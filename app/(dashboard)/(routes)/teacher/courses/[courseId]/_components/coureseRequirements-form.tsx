
// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Minus, Pencil, Plus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { updateCourse } from "@/lib/course/updateCourse";

const formSchema = z.object({
  requirements: z
    .array(
      z.string().max(100, {
        message: "Max 100 characters",
      })
    )
    .transform((requirements) =>
      // Filter out empty strings before saving
      requirements.filter((requirement) => requirement.trim().length > 0)
    ),
});

interface CourseRequirementsFormProps {
  initialData: Course;
  courseId: string;
}

export const CourseRequirementsForm = ({
  initialData,
  courseId,
}: CourseRequirementsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      requirements:
        initialData?.requirements?.length > 0
          ? initialData.requirements
          : [],
    },
  });

  const {
    control,
    handleSubmit,
    trigger, // Add trigger for manual validation
    formState: { isSubmitting, isValid },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  });

  const lastInputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateCourse({
          courseId,
          values,
          toggleEdit,
          setLoading,
          router,
        });
  };

  // Effect to focus the last input when a new field is appended
  useEffect(() => {
    if (isEditing && lastInputRef.current) {
      lastInputRef.current.focus();
    }
  }, [fields.length, isEditing]);

  // Function to handle removing all fields
  const handleRemoveAll = () => {
    // Remove all fields first
    for (let i = fields.length - 1; i >= 0; i--) {
      remove(i);
    }
  };

  // Function to add first field when none exist
  const addFirstField = () => {
    append("");
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course requirements
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit requirements
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div className="text-sm mt-2">
          {!initialData.requirements?.length ? (
            <span className="text-slate-500">No requirements</span>
          ) : (
            initialData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center">
                <span className="h-2 w-2 bg-black rounded-full mr-2"></span>
                <p>{requirement}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {fields.length === 0 && (
              <div className="w-full flex flex-col gap-3">
                <p className="text-sm text-slate-500">No requirements added yet.</p>
                <Button
                  type="button"
                  onClick={addFirstField}
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>
            )}
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="w-full flex flex-row justify-between gap-3"
              >
                <FormField
                  control={control}
                  name={`requirements.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <input
                          {...field}
                          ref={
                            index === fields.length - 1 ? lastInputRef : null
                          }
                          className="font-normal w-full border border-gray-300 rounded"
                          placeholder="Enter course requirement"
                          onChange={(e) => {
                            field.onChange(e);
                            // Trigger validation for this specific field
                            trigger(`requirements.${index}`);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className={`w-10 px-0`}
                  type="button"
                  variant="outline"
                  onClick={() => remove(index)}
                  disabled={isSubmitting}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  className={`w-10 px-0`}
                  type="button"
                  onClick={() => {
                    append("");
                  }}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="w-full flex flex-row gap-5">
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  {loading ? (
                    <Loader className="animate-spin h-4 w-4" />
                  ) : (
                    "Save"
                  )}
                </Button>
                {fields.length > 0 && (
                  <Button
                    type="button"
                    onClick={handleRemoveAll}
                    disabled={isSubmitting}
                    variant="ghost"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};