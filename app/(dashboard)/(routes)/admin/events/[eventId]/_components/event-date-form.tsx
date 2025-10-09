"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";
import { Pencil, Loader, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateEvent } from "@/lib/event/event";
import { format, set } from "date-fns";

interface EventDateFormProps {
  initialData: Event;
  eventId: string;
}

const formSchema = z.object({
  date: z.string().optional(),
});

export const EventDateForm = ({ initialData, eventId }: EventDateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  // Helper function to convert UTC Date to local datetime-local format
  const formatDateForInput = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";

    // Get local timezone offset in minutes
    const timezoneOffset = dateObj.getTimezoneOffset();
    // Create new date adjusted for local timezone
    const localDate = new Date(dateObj.getTime() - timezoneOffset * 60000);

    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    return localDate.toISOString().slice(0, 16);
  };

  // Helper function to format display date in local timezone
  const formatDisplayDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";

    try {
      // This will automatically display in user's local timezone
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
    setValue,
    watch,
    reset,
  } = form;

  // Watch the date field to track changes
  const watchedDate = watch("date");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let finalValues: { date?: string | null } = {};

      if (!values.date || values.date === "") {
        // Set to null to remove the date from database
        finalValues = { date: null };
      } else {
        finalValues.date = new Date(values.date).toISOString();
      }

      await updateEvent({
        eventId,
        values: finalValues,
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

  // Check if the event date has passed (compare in local timezone)
  const isEventPast = initialData?.date
    ? new Date(initialData.date) < new Date()
    : false;

  // Clear the date field
  const clearDate = () => {
    setValue("date", "", { shouldValidate: true, shouldDirty: true });
  };

  // Reset form when starting to edit
  const handleEditToggle = () => {
    if (!isEditing) {
      // Reset form to initial values when starting to edit
      reset({
        date: initialData?.date ? formatDateForInput(initialData.date) : "",
      });
    }
    toggleEdit();
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center">
          Schedule
          {/* <span className="text-red-500">*</span> */}
        </div>
        <Button onClick={handleEditToggle} variant="ghost">
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
            <div className="relative w-fit max-w-md">
              <Input
                type="datetime-local"
                className="h-12 text-base pr-10"
                {...register("date", {
                  validate: (value) => {
                    if (!value || value === "") return true; // allow empty
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
              {/* Clear button */}
              {watchedDate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={clearDate}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {errors.date && (
              <div className="text-red-500 text-sm">{errors.date.message}</div>
            )}
            <p className="text-xs text-gray-500">
              Select the date and time when your event will take place. Time
              will be displayed in your local timezone (
              {Intl.DateTimeFormat().resolvedOptions().timeZone}). The time you
              set here will be preserved for all users regardless of their
              timezone. Leave empty to remove the date.
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
            <Button disabled={loading} type="submit">
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
