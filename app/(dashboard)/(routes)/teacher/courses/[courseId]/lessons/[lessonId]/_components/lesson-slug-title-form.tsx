// @ts-nocheck
"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonSlugTitleFormProps {
  initialData: {
    slug: string;
  };
  courseId: string;
  lessonId: string;
}

const formSchema = z.object({
  slug: z
    .string()
    .min(1, {
      message: "Slug is required",
    })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Slug can only contain English letters, numbers, and hyphens",
    }),
});

export const LessonSlugTitleForm = ({
  initialData,
  courseId,
  lessonId,
}: LessonSlugTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [enrolledStudents, setEnrolledStudents] = useState(0);
  useEffect(() => {
    const getEnrolledStudents = async () => {
      setLoading(true);
      try {
        const count = await fetchEnrolledStudents(courseId);
        setEnrolledStudents(count);
      } catch (error) {
        console.error("Failed to fetch enrolled students:", error);
      } finally {
        setLoading(false);
      }
    };

    getEnrolledStudents();
  }, [courseId]);

  // app\api\courses\[courseId]\student\route.ts
  const fetchEnrolledStudents = async (courseId) => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/student`);
      return response.data.enrolledStudents;
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      throw error; // Re-throw the error for further handling if necessary
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (enrolledStudents > 0) {
      toast.error(
        "You cannot edit this lesson because you have students enrolled in it"
      );
      return;
    }

    setLoading(true); // Set loading to true

    try {
      await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, values);

      toast.success("Lesson updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      // Ensure error is defined and has a response
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("This slug is preoccupied. Please use a different slug.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson slug
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
      {!isEditing && <p className="text-sm mt-2">{initialData.slug}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || loading || enrolledStudents} // Disable if loading
                      placeholder="e.g. 'introduction-to-the-course'"
                      {...field}
                    />
                  </FormControl>
                  {/* Replace FormDescription with a div */}
                  <div className="text-sm text-muted-foreground">
                    <ul className="list-inside list-disc space-y-1">
                      <li>
                        <strong>Must be in English:</strong> Only English
                        letters, numbers, and hyphens allowed. Example:
                        <code>'advanced-web-dev'</code>
                      </li>
                      <li>
                        <strong>Cannot contain spaces:</strong> Use hyphens (-)
                        to separate words. Example:
                        <code>'web-development-course'</code>
                      </li>
                    </ul>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={
                  !isValid || isSubmitting || loading || enrolledStudents
                }
                className={cn(
                  "relative",
                  !isValid || isSubmitting || loading || enrolledStudents
                    ? "bg-black opacity-50 cursor-not-allowed"
                    : "bg-black cursor-pointer"
                )}
              >
                {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
