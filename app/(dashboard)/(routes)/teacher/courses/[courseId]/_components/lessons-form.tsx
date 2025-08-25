// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Course, Lesson } from "@prisma/client";
import axios from "axios";
import { Loader, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LessonsList } from "./lessons-list";
import Link from "next/link";
import { isEnglish, toSlug } from "@/lib/utils/stringUtils";
import { clientApi } from "@/lib/utils/openai/client";
import { revalidatePage } from "@/actions/revalidatePage";

interface LessonsFormProps {
  initialData: Course & { lessons: Lesson[] };
  courseId: string;
  admin?: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Slug can only contain English letters, numbers, and hyphens",
    }),
});

export const LessonsForm = ({
  initialData,
  courseId,
  admin,
}: LessonsFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
    if (!isCreating) {
      form.reset(); // Reset form values when toggling to create mode
    }
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", // Ensure the input starts empty
      slug: "", // Default value for slug
    },
  });

  const {
    isSubmitting,
    trigger,
    formState: { isValid },
  } = form;

  // Handle blur event, generate slug from title and update slug field
  const handleTitleBlur = async () => {
    const titleValue = form.getValues("title");
    if (isEnglish(titleValue)) {
      // Check if the title is in English before populating slug
      const slugValue = toSlug(titleValue);
      form.setValue("slug", slugValue);
      await trigger(); // Trigger validation after setting the slug
    }
  };

  // On form submit, send title and slug to the API
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { title, slug } = values;

    try {
      // Send both title and slug to the API
      await axios.post(`/api/courses/${courseId}/lessons`, { title, slug });
      toast.success("Lesson created");
      toggleCreating();
       await revalidatePage([
      { route: '/(site)', type: "layout" },
      { route: "/courses", type: "layout" },
    ]);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      const axiosError = error as any; // Type-cast if using TypeScript

      const message =
        axiosError?.response?.data || // JSON response like { error: "..." }
        axiosError?.response?.data?.message || // Some APIs use { message: "..." }
        axiosError?.response?.data || // Raw string body
        axiosError?.message || // Axios message like "Request failed with status code 401"
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      const res = await clientApi.reorderLessons({
        params: {
          courseId,
        },
        body: {
          list: updateData,
        },
      });

      if (res.status === 200) {
        toast.success("Lessons reordered");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/${admin ? "admin" : "teacher"}/courses/${courseId}/lessons/${id}`
    );
  };

  return (
    <div className="relative p-4 mt-6 border rounded-md bg-slate-100">
      {isUpdating && (
        <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full bg-slate-500/20 rounded-m">
          <Loader className="w-6 h-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        <div>
          Lessons
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              New lesson
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 space-y-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                      onBlur={handleTitleBlur}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson slug</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'introduction-to-the-course'"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground mt-2">
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        <strong>Must be in English:</strong> Only English
                        letters, numbers, and hyphens allowed. Example:{" "}
                        <code>'advanced-web-dev'</code>
                      </li>
                      <li>
                        <strong>Cannot contain spaces:</strong> Use hyphens (-)
                        to separate words. Example:{" "}
                        <code>'web-development-course'</code>
                      </li>
                    </ul>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button onClick={toggleCreating} type="button" variant="outline">
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting || loading}
                className={cn(
                  "relative",
                  loading || !isValid || isSubmitting
                    ? "bg-black opacity-50 cursor-not-allowed"
                    : "bg-black cursor-pointer"
                )}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.lessons.length && "text-slate-500 italic"
          )}
        >
          {!initialData.lessons.length && "No lessons"}
          <div className="max-h-[600px] overflow-auto">
            <LessonsList
              onEdit={onEdit}
              onReorder={onReorder}
              items={initialData.lessons || []}
            />
          </div>
        </div>
      )}
      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
