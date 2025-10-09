"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Loader } from "lucide-react";
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
import { cn } from "@/lib/utils";
import JoditEditor from "jodit-react";
import { updateCourse } from "@/lib/course/updateCourse";
import { baseJoditConfig } from "@/lib/config/jodit-config";

interface RichTextFormProps {
  // Data props
  initialValue: string;
  entityId: string;
  fieldName: string;
  // Display props
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  maxPreviewLength?: number;
  // API props
  api?: string;

  // Messages
  successMessage?: string;
  errorMessage?: string;

  // Styling
  className?: string;
  containerClassName?: string;

  // Validation
  minLength?: number;
}

// Default validation schema
const createDefaultSchema = (fieldName: string, minLength: number = 1) =>
  z.object({
    [fieldName]: z.string().min(minLength, {
      message: `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`,
    }),
  });

export const RichTextForm = ({
  initialValue = "",
  entityId,
  fieldName,
  label,
  placeholder = `No ${fieldName}`,
  isRequired = true,
  maxPreviewLength = 1200,
  api,
  successMessage,
  errorMessage,
  className,
  containerClassName,
  minLength = 1,
}: RichTextFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const router = useRouter();

  // Use custom schema or create default one
  const formSchema = createDefaultSchema(fieldName, minLength);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [fieldName]: initialValue,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateCourse({
        courseId: entityId,
        values,
        toggleEdit,
        setLoading,
        router,
        successMessage,
        api,
      });
    } catch (error) {
      console.log("ERROR:", error);
      toast.error(errorMessage || "Something went wrong");
    }
  };

  const shortContent = initialValue?.substring(0, maxPreviewLength);
  const showToggleButton = initialValue?.length > maxPreviewLength;

  // Style injection for Jodit editor
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
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Default Jodit config
  const joditConfig = useMemo(() => baseJoditConfig, []);

  return (
    <div
      className={cn(
        "mt-6 border bg-slate-100 rounded-md p-4",
        containerClassName
      )}
    >
      <div className="font-medium flex items-center justify-between">
        <div>
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit {fieldName}
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialValue && "text-slate-500 italic",
            className
          )}
        >
          {!initialValue && placeholder}
          {initialValue && (
            <div>
              <div
                className="text-sm mb-4 text-black text-justify overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: isExpanded ? initialValue : shortContent,
                }}
              />
              {showToggleButton && (
                <button
                  onClick={toggleExpanded}
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
              name={fieldName}
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
                {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

// Export types for consumers
export type { RichTextFormProps };
