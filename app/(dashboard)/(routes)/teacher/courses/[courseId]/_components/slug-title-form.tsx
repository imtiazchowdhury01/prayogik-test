"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { updateCourse } from "@/lib/course/updateCourse";

interface SlugTitleFormProps {
  initialData: {
    slug: string;
  };
  courseId: string;
}

// Update the slug validation to require English letters, numbers, and hyphens
const formSchema = z.object({
  slug: z
    .string()
    .min(1, {
      message: "Slug is required",
    })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Slug can only contain English letters, numbers, and hyphens",
    })
    .transform((val) => val.toLowerCase()), // Auto convert to lowercase
});

export const SlugTitleForm = ({
  initialData,
  courseId,
}: SlugTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateCourse({
      courseId,
      values,
      toggleEdit,
      setLoading,
      router,
    });
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course slug
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
      {!isEditing && <p className="text-sm mt-2">{initialData?.slug}</p>}
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
                      disabled={isSubmitting}
                      placeholder="e.g. 'advanced-web-dev'"
                      {...field}
                      onChange={(e) => {
                        // Convert to lowercase as user types
                        const lowercaseValue = e.target.value.toLowerCase();
                        field.onChange(lowercaseValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`relative ${
                  !isValid || isSubmitting ? "bg-black opacity-50" : "bg-black"
                }`}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
