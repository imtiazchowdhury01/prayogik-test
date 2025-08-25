"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Video, Calendar, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { updateCourse } from "@/lib/course/updateCourse";

interface LiveLinkFormProps {
  initialData: {
    courseLiveLink?: string | null;
    courseLiveLinkPassword?: string | null;
    courseLiveLinkScheduledAt?: Date | null;
  };
  courseId: string;
}

const formSchema = z.object({
  courseLiveLink: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  courseLiveLinkPassword: z.string().optional(),
  courseLiveLinkScheduledAt: z.string().optional(),
});

export const LiveLinkForm = ({ initialData, courseId }: LiveLinkFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  // Format date for input field (datetime-local format)
  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseLiveLink: initialData.courseLiveLink || "",
      courseLiveLinkPassword: initialData.courseLiveLinkPassword || "",
      courseLiveLinkScheduledAt: formatDateForInput(
        initialData.courseLiveLinkScheduledAt
      ),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    // Convert datetime-local string back to ISO string for database
    const processedValues = {
      ...values,
      courseLiveLink: values.courseLiveLink || null,
      courseLiveLinkPassword: values.courseLiveLinkPassword || null,
      courseLiveLinkScheduledAt: values.courseLiveLinkScheduledAt
        ? new Date(values.courseLiveLinkScheduledAt).toISOString()
        : null,
    };

    await updateCourse({
      courseId,
      values: processedValues,
      toggleEdit,
      setLoading,
      router,
    });
  };

  // Format date for display
  const formatDateForDisplay = (date: Date | null | undefined) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          Live Session Details
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Video className="h-3 w-3 text-gray-500" />
            <span className="font-medium">Link:</span>
            <span className="text-gray-700">
              {initialData.courseLiveLink || "Not set"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Lock className="h-3 w-3 text-gray-500" />
            <span className="font-medium">Password:</span>
            <span className="text-gray-700">
              {initialData.courseLiveLinkPassword ? "••••••••" : "Not set"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className="font-medium">Scheduled:</span>
            <span className="text-gray-700">
              {formatDateForDisplay(initialData.courseLiveLinkScheduledAt)}
            </span>
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="courseLiveLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Live Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="https://zoom.us/j/1234567890 or https://meet.google.com/abc-def-ghi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseLiveLinkPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Meeting Password (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter meeting password if required"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseLiveLinkScheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Scheduled Date & Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
