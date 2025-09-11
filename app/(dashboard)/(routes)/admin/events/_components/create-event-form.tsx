"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isEnglish } from "@/lib/utils/stringUtils";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Event title is required").trim(),
  slug: z
    .string()
    .min(1, "Event slug is required")
    .refine((val) => isEnglish(val), {
      message: "Slug can only contain English letters, numbers, and hyphens",
    })
    .refine((val) => !val.includes(" "), {
      message: "Slug cannot contain spaces",
    }),
});

export type CreateEventFormData = z.infer<typeof formSchema>;

interface CreateEventFormProps {
  onSubmit: (data: CreateEventFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CreateEventForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: CreateEventFormProps) {
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const handleTitleChange = (value: string) => {
    const slugFromTitle = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    form.setValue("slug", slugFromTitle);
  };

  const handleSlugChange = (value: string) => {
    // Remove spaces and other invalid characters
    const cleanedValue = value.replace(/\s+/g, "").replace(/[^a-z0-9-]/g, "");
    return cleanedValue;
  };

  const handleFormSubmit = async (data: CreateEventFormData) => {
    await onSubmit(data);
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter event title..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleTitleChange(e.target.value);
                    }}
                    disabled={isLoading}
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
                <FormLabel>Event Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="event-slug"
                    {...field}
                    onChange={(e) => {
                      const cleanedValue = handleSlugChange(e.target.value);
                      field.onChange(cleanedValue);
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={14} />
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
