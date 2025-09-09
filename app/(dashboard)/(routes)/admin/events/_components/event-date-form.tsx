"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";
import { Pencil, Loader, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateEvent } from "@/lib/event/event";
import { format } from "date-fns";

interface EventDateFormProps {
  initialData: Event;
  eventId: string;
}

const formSchema = z.object({
  date: z.string().refine(
    (dateString) => {
      const date = new Date(dateString);
      const now = new Date();

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return false;
      }

      // Check if the date is in the future
      return date > now;
    },
    {
      message: "Event date must be in the future",
    }
  ),
});

export const EventDateForm = ({ initialData, eventId }: EventDateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  // Helper function to convert Date to datetime-local format
  const formatDateForInput = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Helper function to format display date
  const formatDisplayDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";

    try {
      return format(dateObj, "PPPp"); // e.g., "January 1st, 2024 at 2:30 PM"
    } catch {
      return dateObj.toLocaleString();
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialData?.date ? formatDateForInput(initialData.date) : "",
    },
    mode: "onChange",
  });

  const {
    register,
    formState: { errors, isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Convert the datetime-local string to ISO string for the backend
      const finalValues = {
        date: new Date(values.date).toISOString(),
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

  // Check if the event date has passed
  const isEventPast = initialData?.date
    ? new Date(initialData.date) < new Date()
    : false;

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center">
          Event Date & Time
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit date
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-3 mt-4">
          {initialData.date ? (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {formatDisplayDate(initialData.date)}
                  </p>
                  {isEventPast && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md inline-block mt-1">
                      ⚠️ This event date has passed
                    </p>
                  )}
                </div>
              </div>

              {/* Additional date information */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </p>
                <p>
                  {isEventPast
                    ? `Event was ${Math.ceil(
                        (Date.now() - new Date(initialData.date).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )} days ago`
                    : `Event is in ${Math.ceil(
                        (new Date(initialData.date).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      )} days`}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              No date set
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              type="datetime-local"
              className="h-12 text-base w-full max-w-md"
              {...register("date", {
                required: "Event date is required",
                validate: (value) => {
                  const date = new Date(value);
                  const now = new Date();

                  if (isNaN(date.getTime())) {
                    return "Please enter a valid date and time";
                  }

                  if (date <= now) {
                    return "Event date must be in the future";
                  }

                  return true;
                },
              })}
            />
            {errors.date && (
              <div className="text-red-500 text-sm">{errors.date.message}</div>
            )}
            <p className="text-xs text-gray-500">
              Select the date and time when your event will take place. Time
              will be displayed in your local timezone (
              {Intl.DateTimeFormat().resolvedOptions().timeZone}).
            </p>
          </div>

          {/* Warning if setting past date */}
          {isEventPast && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-700">
                ⚠️ Note: The current event date has passed. Make sure to set a
                future date.
              </p>
            </div>
          )}

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
