// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import { Minus, Pencil, Plus, Loader } from "lucide-react"; // Import Loader
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  learningOutcomes: z
    .array(
      z.string().max(100, {
        message: "Max 100 characters",
      })
    )
    .transform((outcomes) =>
      // Filter out empty strings before saving
      outcomes.filter((outcome) => outcome.trim().length > 0)
    ),
});

interface LearningOutcomesFormProps {
  initialData: Course;
  courseId: string;
}

export const LearningOutcomesForm = ({
  initialData,
  courseId,
}: LearningOutcomesFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      learningOutcomes:
        initialData?.learningOutcomes?.length > 0
          ? initialData.learningOutcomes
          : [""],
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
    name: "learningOutcomes",
  });

  const lastInputRef = useRef<HTMLInputElement | null>(null); // Ref for the last input field

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
      lastInputRef.current.focus(); // Focus the last input field
    }
  }, [fields.length, isEditing]);

  // Function to handle removing all fields
  const handleRemoveAll = () => {
    // Remove all fields first
    for (let i = fields.length - 1; i >= 0; i--) {
      remove(i);
    }
    // // Then add one empty field to maintain UI consistency
    // append("");
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Learning outcomes
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit outcomes
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div className="text-sm mt-2">
          {!initialData.learningOutcomes?.length ? (
            <span className="text-slate-500">No learning outcomes</span>
          ) : (
            initialData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center">
                <span className="h-2 w-2 bg-black rounded-full mr-2"></span>{" "}
                <p>{outcome}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {fields?.length === 0 && (
              <div className="w-full flex flex-col gap-3">
                <p className="text-sm text-slate-500">
                  No learning outcomes added yet.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    append("");
                  }}
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Learning Outcome
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
                  name={`learningOutcomes.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <input
                          {...field}
                          ref={
                            index === fields.length - 1 ? lastInputRef : null
                          } // Set ref on the last input
                          className="font-normal w-full border border-gray-300 rounded"
                          placeholder="Enter learning outcome"
                          onChange={(e) => {
                            field.onChange(e);
                            // Trigger validation for this specific field
                            trigger(`learningOutcomes.${index}`);
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
                    variant="outline"
                    onClick={handleRemoveAll}
                    disabled={isSubmitting}
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
