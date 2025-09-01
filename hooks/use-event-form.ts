// hooks/useEventForm.ts
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import * as z from "zod";
import { createEvent, updateEvent } from "@/lib/event/event";
import { uploadEventImageToS3, uploadSpeakerImageToS3 } from "@/actions/upload-aws";
import { formatDateForInput } from "@/lib/formatDateForInput";
import { baseJoditConfig } from "@/lib/config/jodit-config";
import { EVENT_TYPES } from "@/data/event-constant";

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

const speakerSchema = z.object({
  name: z.string().min(1, "Speaker name is required"),
  designation: z.string().optional(),
  avatarUrl: z.string().min(1, "Speaker image is required"),
});

const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    date: z.string({ required_error: "Date is required" }),
    type: z.enum(EVENT_TYPES.map(e => e.value) as [typeof EVENT_TYPES[number]["value"], ...string[]], {
      required_error: "Event type is required",
      message: "Please select an event type from the list",
    }),
    isOnline: z.boolean().default(false),
    location: z.string().optional(),
    zoomLink: z.string().url().optional().or(z.literal("")),
    imageUrl: z.string().optional(),
    mapLocation: z.string().optional(),
    speakers: z.array(speakerSchema).default([]),
    faqs: z.array(faqSchema).default([]),
  })
  .refine(
    (data) => {
      if (!data.isOnline && !data.location) return false;
      if (
        data.isOnline &&
        data.zoomLink &&
        !z.string().url().safeParse(data.zoomLink).success
      )
        return false;
      return true;
    },
    {
      message:
        "Location is required for offline events, and Zoom link must be a valid URL for online events",
      path: ["location"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export const useEventForm = (initialData?: any, mode: "create" | "update" = "create") => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [speakerImageUploading, setSpeakerImageUploading] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentStep, setCurrentStep] = useState("basic");

  const router = useRouter();
  const { data: sessionData } = useSession();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      date:
        initialData && initialData.date
          ? formatDateForInput(initialData.date)
          : "",
      type: initialData?.type || "",
      isOnline: initialData?.isOnline || false,
      location: initialData?.location || "",
      zoomLink: initialData?.zoomLink || "",
      imageUrl: initialData?.imageUrl || "",
      mapLocation: initialData?.mapLocation || "",
      speakers: initialData?.speakers || [],
      faqs: initialData?.faqs || [],
    },
  });

  const watchIsOnline = form.watch("isOnline");
  const watchTitle = form.watch("title");

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === "create" && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug);
    }
  }, [watchTitle, form, mode]);

  const joditConfig = useMemo(() => baseJoditConfig, []);

  const handleEventImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("eventSrc", file);

      if (initialData?.imageUrl) {
        formData.append("previousUrl", initialData.imageUrl);
      }

      const response = await uploadEventImageToS3(
        formData,
        initialData?.id || "temp"
      );

      if (response.success) {
        form.setValue("imageUrl", response.url);
        toast.success("Event image uploaded successfully");
      } else {
        toast.error("Failed to upload event image");
      }
    } catch (error) {
      toast.error("Error uploading event image");
    } finally {
      setUploading(false);
    }
  };

  const handleSpeakerImageUpload = async (file: File, speakerIndex: number) => {
    try {
      setSpeakerImageUploading((prev) => ({ ...prev, [speakerIndex]: true }));

      const formData = new FormData();
      formData.append("speakerSrc", file);

      const currentSpeaker = form.getValues(`speakers.${speakerIndex}`);
      if (currentSpeaker?.avatarUrl) {
        formData.append("previousUrl", currentSpeaker.avatarUrl);
      }

      const eventId = initialData?.id || "temp";
      const speakerId = `speaker-${speakerIndex}-${Date.now()}`;

      const response = await uploadSpeakerImageToS3(
        formData,
        eventId,
        speakerId
      );

      if (response.success) {
        form.setValue(`speakers.${speakerIndex}.avatarUrl`, response.url);
        toast.success("Speaker image uploaded successfully");
      } else {
        toast.error("Failed to upload speaker image");
      }
    } catch (error) {
      toast.error("Error uploading speaker image");
    } finally {
      setSpeakerImageUploading((prev) => ({ ...prev, [speakerIndex]: false }));
    }
  };

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      const eventData = {
        title: values.title,
        slug: values.slug,
        description: values.description || undefined,
        date: values.date,
        type: values.type,
        isOnline: values.isOnline,
        location: values.location || undefined,
        zoomLink: values.zoomLink || undefined,
        imageUrl: values.imageUrl || undefined,
        mapLocation: values.mapLocation || undefined,
        isPublished: initialData?.isPublished || false,
        speakers: values.speakers.filter(
          (speaker) => speaker.name.trim() && speaker.avatarUrl
        ),
        faqs: values.faqs.filter(
          (faq) => faq.question.trim() && faq.answer.trim()
        ),
      };

      let result;

      if (mode === "create") {
        result = await createEvent(eventData);
        if (result.success) {
          toast.success("Event created successfully");
          router.push(`/admin/events`);
        }
      } else {
        if (!initialData?.id) {
          throw new Error("Event ID is required for updates");
        }

        const updateData: Partial<typeof eventData> = {};

        if (eventData.title !== initialData.title)
          updateData.title = eventData.title;
        if (eventData.slug !== initialData.slug)
          updateData.slug = eventData.slug;
        if (eventData.description !== initialData.description)
          updateData.description = eventData.description;
        if (eventData.date !== initialData.date)
          updateData.date = eventData.date;
        if (eventData.type !== initialData.type)
          updateData.type = eventData.type;
        if (eventData.isOnline !== initialData.isOnline)
          updateData.isOnline = eventData.isOnline;
        if (eventData.location !== initialData.location)
          updateData.location = eventData.location;
        if (eventData.zoomLink !== initialData.zoomLink)
          updateData.zoomLink = eventData.zoomLink;
        if (eventData.imageUrl !== initialData.imageUrl)
          updateData.imageUrl = eventData.imageUrl;
        if (eventData.mapLocation !== initialData.mapLocation)
          updateData.mapLocation = eventData.mapLocation;

        // Always update speakers and faqs as they might have changed
        updateData.speakers = eventData.speakers;
        updateData.faqs = eventData.faqs;

        result = await updateEvent(initialData.id, updateData);
        if (result.success) {
          toast.success("Event updated successfully");
          router.refresh();
        }
      }

      if (!result.success) {
        if (result.details?.includes("slug already exists")) {
          form.setError("slug", {
            message:
              "This slug is already taken. Please choose a different one.",
          });
          toast.error("Event slug already exists");
        } else {
          toast.error(result.error || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    uploading,
    speakerImageUploading,
    currentStep,
    setCurrentStep,
    watchIsOnline,
    watchTitle,
    joditConfig,
    handleEventImageUpload,
    handleSpeakerImageUpload,
    onSubmit,
  };
};