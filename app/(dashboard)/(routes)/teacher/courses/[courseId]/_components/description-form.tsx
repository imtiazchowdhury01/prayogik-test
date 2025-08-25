// @ts-nocheck

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Tiptap from "@/components/ui/tiptap/tiptap";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";
import { Loader } from "lucide-react"; // Import Loader
import JoditEditor, { IJoditEditorProps } from "jodit-react";
import { updateCourse } from "@/lib/course/updateCourse";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export const DescriptionForm = ({
  initialData,
  courseId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleDescription = () => setIsExpanded(!isExpanded);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
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

  const shortDescription = initialData?.description?.substring(0, 1200);
  const showToggleButtons = initialData?.description?.length > 1200;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    .jodit-wysiwyg h1 {
      font-size: 20px !important;
      font-weight: bold !important;
      display: block !important;
    }
    .jodit-wysiwyg h2 {
      font-size: 18px !important;
      font-weight: bold !important;
      display: block !important;
    }
    .jodit-wysiwyg h3 {
      font-size: 16px !important;
      font-weight: bold !important;
      display: block !important;
    }
    .jodit-wysiwyg ul {
      list-style-type: disc !important;
      margin-left: 1.5em !important;
      padding-left: 1em !important;
    }
    .jodit-wysiwyg ol {
      list-style-type: decimal !important;
      margin-left: 1.5em !important;
      padding-left: 1em !important;
    }
    .jodit-wysiwyg li {
      display: list-item !important;
      margin-left: 0 !important;
    }
    .jodit-wysiwyg ul li {
      list-style-type: disc !important;
    }
    .jodit-wysiwyg ol li {
      list-style-type: decimal !important;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Memoize the Jodit config to prevent recreation on every render
  const joditConfig: IJoditEditorProps["config"] = useMemo(
    () => ({
      defaultActionOnPaste: "insert_only_text",
      removeButtons: ["preview"], // This removes the eye icon
      askBeforePasteHTML: false,
      editorStyle: {
        "font-family": "'Noto Serif Bengali', serif !important",
      },
      controls: {
        font: {
          list: {
            "Noto Serif Bengali, serif": "Noto Serif Bengali",
            "Arial, sans-serif": "Arial",
            "Times New Roman, serif": "Times New Roman",
            "Helvetica, sans-serif": "Helvetica",
            "Georgia, serif": "Georgia",
            "Verdana, sans-serif": "Verdana",
          },
          default: "Noto Serif Bengali",
        },
      },
      style: {
        fontFamily: "'Noto Serif Bengali', serif",
        "h1, h2, h3, h4": {
          display: "block",
          fontWeight: "bold",
        },
        h1: {
          fontSize: "20px",
          marginTop: "0.67em",
          marginBottom: "0.67em",
        },
        h2: {
          fontSize: "18px",
          marginTop: "0.83em",
          marginBottom: "0.83em",
        },
        h3: {
          fontSize: "16px",
          marginTop: "1em",
          marginBottom: "1em",
        },
        h4: {
          fontSize: "16px",
          marginTop: "1.33em",
          marginBottom: "1.33em",
        },
        ul: {
          listStyleType: "disc",
          marginLeft: "1.5em",
          paddingLeft: "1em",
        },
        ol: {
          listStyleType: "decimal",
          marginLeft: "1.5em",
          paddingLeft: "1em",
        },
        li: {
          display: "list-item",
        },
      },
    }),
    []
  );
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div>
          Course description
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description && "No description"}
          {initialData.description && (
            <div>
              <p
                className="text-sm mb-4 text-black text-justify overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: isExpanded
                    ? initialData?.description
                    : `${shortDescription}`,
                }}
              />
              {showToggleButtons && (
                <button
                  onClick={toggleDescription}
                  className="text-blue-500 hover:underline text-sm"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <JoditEditor {...field} config={joditConfig} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {loading ? (
                  <Loader className="animate-spin h-4 w-4" /> // Circular progress indicator
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
