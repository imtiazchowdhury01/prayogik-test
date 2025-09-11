"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";
import { Pencil, Loader, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { updateEvent } from "@/lib/event/event";

interface EventLocationFormProps {
  initialData: Event;
  eventId: string;
}

// Schema with conditional validation
const formSchema = z
  .object({
    isOnline: z.boolean().default(false),
    location: z.string().optional(),
    mapLocation: z.string().optional(),
    zoomLink: z.string().optional(),
  })
  .refine(
    (data) => {
      // If it's an online event, zoomLink is required
      if (data.isOnline) {
        return data.zoomLink && data.zoomLink.trim().length > 0;
      }
      // If it's not online, location is required
      return data.location && data.location.trim().length > 0;
    },
    {
      message:
        "Location is required for offline events, Meeting link is required for online events",
      path: ["location"], // This will show error on location field, but we'll handle it dynamically
    }
  );

export const EventLocationForm = ({
  initialData,
  eventId,
}: EventLocationFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isOnline: initialData?.isOnline || false,
      location: initialData?.location || "",
      mapLocation: initialData?.mapLocation || "",
      zoomLink: initialData?.zoomLink || "",
    },
    mode: "onChange",
  });

  const {
    watch,
    register,
    setValue,
    formState: { errors, isValid },
  } = form;

  const watchIsOnline = watch("isOnline");

  // Handle checkbox change
  const handleOnlineChange = (checked: boolean) => {
    setValue("isOnline", checked, { shouldValidate: true });

    // Clear opposite fields when switching
    if (checked) {
      setValue("location", "", { shouldValidate: true });
      setValue("mapLocation", "", { shouldValidate: true });
    } else {
      setValue("zoomLink", "", { shouldValidate: true });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Prepare final values, clearing unused fields
      const finalValues = {
        ...values,
        isOnline: values.isOnline,
        location: values.isOnline ? undefined : values.location,
        mapLocation: values.isOnline ? undefined : values.mapLocation,
        zoomLink: !values.isOnline ? undefined : values.zoomLink,
      };

      await updateEvent({
        eventId,
        values: finalValues,
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

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center">
         Location
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit location
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-3 mt-4">
          {/* Event Type Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {initialData.isOnline ? "Online Event" : "In-Person Event"}
            </span>
          </div>

          {/* Location Details */}
          {initialData.isOnline ? (
            <div className="space-y-2">
              {initialData.zoomLink ? (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Meeting Link
                  </p>
                  <p className="text-sm break-all">
                    <a
                      href={initialData.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {initialData.zoomLink}
                    </a>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No meeting link provided
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {initialData.location ? (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Venue Address
                  </p>
                  <p className="text-sm">{initialData.location}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No location provided
                </p>
              )}

              {initialData.mapLocation && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Map Location
                  </p>
                  <p className="text-sm break-all">
                    <a
                      href={initialData.mapLocation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      View on Map
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Online Event Checkbox */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg bg-white">
            <Checkbox
              checked={watchIsOnline}
              onCheckedChange={handleOnlineChange}
              className="data-[state=checked]:bg-brand data-[state=checked]:border-brand"
            />
            <div className="flex items-center gap-2">
              <label className="text-base font-medium cursor-pointer">
                This is an online event
              </label>
            </div>
          </div>

          {/* Conditional Fields */}
          {watchIsOnline ? (
            // Online Event - Meeting Link
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Meeting Link <span className="text-red-500">*</span>
              </label>
              <Input
                type="url"
                placeholder="https://zoom.us/j/... or meeting platform URL"
                className="h-12"
                {...register("zoomLink", {
                  required: watchIsOnline
                    ? "Meeting link is required for online events"
                    : false,
                  pattern: watchIsOnline
                    ? {
                        value: /^https?:\/\/.+/,
                        message: "Please enter a valid URL",
                      }
                    : undefined,
                })}
              />
              {errors.zoomLink && (
                <div className="text-red-500 text-sm">
                  {errors.zoomLink.message}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Provide the direct link to join your online event (Zoom, Google
                Meet, etc.)
              </p>
            </div>
          ) : (
            // In-Person Event - Location Fields
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Venue Location <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter event venue address"
                  className="h-12"
                  {...register("location", {
                    required: !watchIsOnline
                      ? "Location is required for in-person events"
                      : false,
                  })}
                />
                {errors.location && (
                  <div className="text-red-500 text-sm">
                    {errors.location.message}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Full address where the event will take place
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Map Location <span className="text-gray-400">(Optional)</span>
                </label>
                <Input
                  placeholder="Google Maps URL or coordinates"
                  className="h-12"
                  {...register("mapLocation")}
                />
                <p className="text-xs text-gray-500">
                  Google Maps link or coordinates to help attendees find the
                  venue
                </p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-x-2 pt-4">
            <Button disabled={!isValid || loading} type="submit">
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
