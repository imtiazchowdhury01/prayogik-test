
// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createEvent, updateEvent } from "@/lib/event/event";
import {
  uploadEventImageToS3,
  uploadSpeakerImageToS3,
} from "@/actions/upload-aws";
import { formatDateForInput } from "@/lib/formatDateForInput";
import { baseJoditConfig } from "@/lib/config/jodit-config";
import { revalidatePage } from "@/actions/revalidatePage";
import {
  CreateEventInput,
  CreateEventSchema,
  UpdateEventInput,
  UpdateEventSchema,
  createUpdateEventSchemaWithContext,
  validateEventData,
} from "@/schemas/event-schema";

// Event status options based on Prisma schema
const EVENT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "CLOSED", label: "Closed" },
] as const;

// Union type for form data
type EventFormData = CreateEventInput | UpdateEventInput;

export const useEventForm = (
  initialData?: any,
  mode: "create" | "update" = "create"
) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [speakerImageUploading, setSpeakerImageUploading] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentStep, setCurrentStep] = useState("basic");

  const router = useRouter();

  // Create dynamic schema based on mode and existing data
  const schema = useMemo(() => {
    if (mode === "create") {
      return CreateEventSchema;
    } else if (initialData) {
      // Use context-aware schema for updates
      return createUpdateEventSchemaWithContext({
        isOnline: initialData.isOnline,
        location: initialData.location,
        zoomLink: initialData.zoomLink,
        type: initialData.type,
        price: initialData.price,
      });
    } else {
      return UpdateEventSchema;
    }
  }, [mode, initialData]);

  const form = useForm<EventFormData>({
    resolver: zodResolver(schema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      price: initialData?.price || undefined,
      status: initialData?.status || "DRAFT",
      date:
        initialData && initialData.date
          ? formatDateForInput(initialData.date)
          : "",
      type: initialData?.type || "FREE",
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
  const watchType = form.watch("type");

  // Auto-generate slug from title (only for create mode)
  useEffect(() => {
    if (mode === "create" && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug);
    }
  }, [watchTitle, form, mode]);

  // Clear price when event type changes to FREE
  useEffect(() => {
    if (watchType === "FREE") {
      form.setValue("price", undefined);
      form.clearErrors("price"); // Clear any price validation errors
    }
  }, [watchType, form]);

  // Handle conditional field clearing and validation
  useEffect(() => {
    if (watchIsOnline === true) {
      // Clear location when switching to online
      form.setValue("location", "");
      form.setValue("mapLocation", "");
      form.clearErrors("location");

      // Validate zoom link if it's empty
      const currentZoomLink = form.getValues("zoomLink");
      if (!currentZoomLink || currentZoomLink.trim() === "") {
        form.trigger("zoomLink"); // Trigger validation
      }
    } else if (watchIsOnline === false) {
      // Clear zoom link when switching to offline
      form.setValue("zoomLink", "");
      form.clearErrors("zoomLink");
    }
  }, [watchIsOnline, form]);

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

  // Enhanced validation before submission
  const validateFormData = (values: EventFormData) => {
    const validation = validateEventData(
      values,
      mode === "update",
      mode === "update"
        ? {
            isOnline: initialData?.isOnline || false,
            location: initialData?.location,
            zoomLink: initialData?.zoomLink,
            type: initialData?.type || "FREE",
            price: initialData?.price,
          }
        : undefined
    );

    if (!validation.success) {
      // Set form errors based on validation results
      validation.error.errors.forEach((error) => {
        const field = error.path[0] as keyof EventFormData;
        form.setError(field, { message: error.message });
      });
      return false;
    }
    return true;
  };

  const onSubmit = async (values: EventFormData) => {

    // Additional validation before submission
    if (!validateFormData(values)) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        title: values.title,
        slug: values.slug,
        description: values.description || undefined,
        price: values.type === "PAID" ? Number(values.price) : null,
        status: values.status,
        date: values.date,
        type: values.type,
        isOnline: values.isOnline || false,
        location: values.isOnline ? undefined : values.location || undefined,
        zoomLink: values.isOnline ? values.zoomLink || undefined : undefined,
        imageUrl: values.imageUrl || undefined,
        mapLocation: values.isOnline
          ? undefined
          : values.mapLocation || undefined,
        isPublished: initialData?.isPublished || false,
        speakers:
          values.speakers?.filter(
            (speaker) => speaker.name.trim() && speaker.avatarUrl
          ) || [],
        faqs:
          values.faqs?.filter(
            (faq) => faq.question.trim() && faq.answer.trim()
          ) || [],
      };

      let result;

      if (mode === "create") {
        result = await createEvent(eventData);
        if (result.success) {
          toast.success("Event created successfully");
          revalidatePage([{ route: "/home" }, { route: "/events" }]);
          router.push(`/admin/events`);
        }
      } else {
        if (!initialData?.id) {
          throw new Error("Event ID is required for updates");
        }

        // Only include changed fields for update
        const updateData: Partial<typeof eventData> = {};

        // Check each field for changes
        if (eventData.title !== initialData.title)
          updateData.title = eventData.title;
        if (eventData.slug !== initialData.slug)
          updateData.slug = eventData.slug;
        if (eventData.description !== initialData.description)
          updateData.description = eventData.description;
        if (eventData.price !== initialData.price)
          updateData.price = eventData.price;
        if (eventData.status !== initialData.status)
          updateData.status = eventData.status;
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
          revalidatePage([{ route: "/home" }, { route: "/events" }]);
          router.push(`/admin/events`);
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

  // Helper functions for conditional field requirements
  const isLocationRequired = watchIsOnline === false;
  const isZoomLinkRequired = watchIsOnline === true;
  const isPriceRequired = watchType === "PAID";

  return {
    form,
    loading,
    uploading,
    speakerImageUploading,
    currentStep,
    setCurrentStep,
    watchIsOnline,
    watchTitle,
    watchType,
    joditConfig,
    handleEventImageUpload,
    handleSpeakerImageUpload,
    onSubmit,
    EVENT_STATUS_OPTIONS,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
    isLocationRequired,
    isZoomLinkRequired,
    isPriceRequired,
    validateFormData,
  };
};
