// @ts-nocheck
"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useState } from "react";
import { isEnglish, toSlug } from "@/lib/utils/stringUtils";

const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b(\w)/g, (match) => match.toUpperCase());
};

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, { message: "Slug is required" }),
  // .regex(/^[a-zA-Z0-9-]+$/, {
  //   message: "Slug can only contain English letters, numbers, and hyphens",
  // }),
});

const CreatePage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const {
    isSubmitting,
    trigger,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    if (isEnglish(values.title)) {
      values.title = toTitleCase(values.title);
    }

    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      router.refresh(); 
      toast.success("Course created");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("This slug is preoccupied. Please use a different slug.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTitleBlur = async () => {
    const titleValue = form.getValues("title");

    if (isEnglish(titleValue)) {
      // Check if the title is in English before populating slug
      const slugValue = toSlug(titleValue);
      // console.log(slugValue);

      form.setValue("slug", slugValue);
      await trigger(); // Trigger validation after setting the slug
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                      onBlur={handleTitleBlur}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course slug</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'advanced-web-dev'"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground mt-2">
                    <ul className="list-inside list-disc space-y-1">
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
              <Link href="/teacher/courses">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`relative ${
                  !isValid || isSubmitting ? "bg-gray-700" : "bg-black"
                }`}
              >
                {loading ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
