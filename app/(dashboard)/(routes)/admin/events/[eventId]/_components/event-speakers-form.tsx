"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";
import {
  Pencil,
  Loader,
  Users,
  Plus,
  Trash2,
  User,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateEvent } from "@/lib/event/event";
import {
  deleteImageFromS3,
  uploadSpeakerImageToS3,
} from "@/actions/upload-aws";

interface EventSpeakersFormProps {
  initialData: Event;
  eventId: string;
}

const speakerSchema = z.object({
  name: z.string().min(1, "Speaker name is required"),
  designation: z.string().optional(),
  avatarUrl: z
    .string()
    .min(1, "Speaker image is required")
    .url("Please enter a valid URL"),
});

const formSchema = z.object({
  speakers: z.array(speakerSchema),
});

type FormData = z.infer<typeof formSchema>;
type Speaker = z.infer<typeof speakerSchema>;

export const EventSpeakersForm = ({
  initialData,
  eventId,
}: EventSpeakersFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingSpeakerIndex, setDeletingSpeakerIndex] = useState<
    number | null
  >(null);
  const [speakerImageUploading, setSpeakerImageUploading] = useState<{
    [key: number]: boolean;
  }>({});
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      speakers:
        initialData?.speakers?.length > 0
          ? initialData.speakers.map((speaker) => ({
              name: speaker.name,
              designation: speaker.designation || "",
              avatarUrl: speaker.avatarUrl || "",
            }))
          : [{ name: "", designation: "", avatarUrl: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "speakers",
  });

  const {
    register,
    formState: { errors, isValid },
  } = form;

  const addSpeaker = () => {
    append({ name: "", designation: "", avatarUrl: "" });
  };

  const removeSpeaker = async (index: number) => {
    if (fields.length > 1) {
      setDeletingSpeakerIndex(index);
      const speakerData = form.getValues(`speakers.${index}`);

      if (speakerData?.avatarUrl) {
        try {
          const imageKey = speakerData.avatarUrl.split(".amazonaws.com/")[1];
          if (imageKey) {
            await deleteImageFromS3(imageKey);
            // console.log(`Successfully deleted speaker image: ${imageKey}`);
          }
        } catch (error) {
          console.error("Error deleting speaker image:", error);
        }
      }

      remove(index);
      setDeletingSpeakerIndex(null);
    }
    if (fields.length === 1) {
      //   clear image from S3 if exists
      const speakerData = form.getValues(`speakers.0`);
      if (speakerData?.avatarUrl) {
        try {
          const imageKey = speakerData.avatarUrl.split(".amazonaws.com/")[1];
          if (imageKey) {
            await deleteImageFromS3(imageKey);
            console.log(`Successfully deleted speaker image: ${imageKey}`);
          }
        } catch (error) {
          console.error("Error deleting speaker image:", error);
        }
      }
      // set empty array if only one speaker is left
      form.setValue("speakers", []);
    }
  };

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      const validSpeakers = values.speakers
        .filter(
          (speaker) =>
            speaker.name.trim().length > 0 &&
            speaker.avatarUrl &&
            speaker.avatarUrl.trim().length > 0
        )
        .map((speaker) => ({
          name: speaker.name.trim(),
          designation: speaker.designation?.trim() || "",
          avatarUrl: speaker.avatarUrl.trim(),
        }));

      await updateEvent({
        eventId,
        values: { speakers: validSpeakers },
        slug: initialData.slug,
        toggleEdit,
        setLoading,
        router,
      });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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

      const eventIdValue = initialData?.id || "temp";
      const speakerId = `speaker-${speakerIndex}-${Date.now()}`;

      const response = await uploadSpeakerImageToS3(
        formData,
        eventIdValue,
        speakerId
      );

      if (response.success) {
        form.setValue(`speakers.${speakerIndex}.avatarUrl`, response.url);
        await form.trigger("speakers");
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

  const handleImageFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    speakerIndex: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      handleSpeakerImageUpload(file, speakerIndex);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Speakers
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit speakers
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {initialData.speakers && initialData.speakers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialData.speakers.map((speaker, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-start gap-3">
                    {speaker.avatarUrl ? (
                      <img
                        src={speaker.avatarUrl}
                        alt={speaker.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {speaker.name}
                      </h4>
                      {speaker.designation && (
                        <p className="text-sm text-gray-600 mt-1">
                          {speaker.designation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic flex items-center gap-2">
              No speakers added yet
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    Speaker {index + 1}
                  </h4>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpeaker(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={deletingSpeakerIndex === index}
                  >
                    {deletingSpeakerIndex === index ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Speaker Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter speaker's full name"
                      {...register(`speakers.${index}.name`)}
                    />
                    {errors.speakers?.[index]?.name && (
                      <div className="text-red-500 text-sm">
                        {errors.speakers[index]?.name?.message}
                      </div>
                    )}
                  </div>

                  {/* Speaker Designation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Designation{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <Input
                      placeholder="e.g., CEO at Company, Senior Developer, etc."
                      {...register(`speakers.${index}.designation`)}
                    />
                    {errors.speakers?.[index]?.designation && (
                      <div className="text-red-500 text-sm">
                        {errors.speakers[index]?.designation?.message}
                      </div>
                    )}
                  </div>

                  {/* Speaker Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Speaker Image <span className="text-red-500">*</span>
                    </label>

                    {form.watch(`speakers.${index}.avatarUrl`) && (
                      <div className="relative w-20 h-20">
                        <img
                          src={form.watch(`speakers.${index}.avatarUrl`)}
                          alt="Speaker preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`speaker-image-${index}`}
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                          disabled={speakerImageUploading[index]}
                        >
                          <span className="flex items-center gap-2">
                            {speakerImageUploading[index] ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            {speakerImageUploading[index]
                              ? "Uploading..."
                              : form.watch(`speakers.${index}.avatarUrl`)
                              ? "Change Image"
                              : "Upload Image"}
                          </span>
                        </Button>
                      </label>
                      <input
                        id={`speaker-image-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileSelect(e, index)}
                        disabled={speakerImageUploading[index]}
                      />
                    </div>

                    {errors.speakers?.[index]?.avatarUrl && (
                      <div className="text-red-500 text-sm">
                        {errors.speakers[index]?.avatarUrl?.message}
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Upload a profile picture for the speaker (max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addSpeaker}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Speaker
          </Button>

          <div className="flex items-center gap-x-2 pt-4">
            <Button disabled={!isValid || loading} type="submit">
              {loading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                "Save Speakers"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
