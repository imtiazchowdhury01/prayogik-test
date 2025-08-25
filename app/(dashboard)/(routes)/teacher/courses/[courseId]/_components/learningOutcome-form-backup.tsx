// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import Tiptap from "@/components/ui/tiptap/tiptap";
import { Preview } from "@/components/preview";

interface LearningOutcomesFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  learningOutcomes: z.array(
    z.string().min(1, { message: "Learning outcome is required" })
  ),
});

export const LearningOutcomesForm = ({
  initialData,
  courseId,
}: LearningOutcomesFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      learningOutcomes: initialData?.learningOutcomes || [""],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "learningOutcomes",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
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

      {!isEditing && (
        <div className="text-sm mt-2">
          {!initialData.learningOutcomes.length && "No learning outcomes"}
          {initialData.learningOutcomes && (
            <Preview value={initialData.learningOutcomes} />
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {fields.map((item, index) => (
              <FormField
                key={item.id}
                control={control}
                name={`learningOutcomes.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Tiptap {...field} className="font-normal" />
                    </FormControl>
                    <Button type="button" onClick={() => remove(index)}>
                      Remove
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="button" onClick={() => append("")}>
              Add More
            </Button>
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
