"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";
import {
  Pencil,
  Loader,
  HelpCircle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateEvent } from "@/lib/event/event";

interface EventFAQFormProps {
  initialData: Event;
  eventId: string;
}

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

const formSchema = z.object({
  faqs: z.array(faqSchema),
});

type FormData = z.infer<typeof formSchema>;
type FAQ = z.infer<typeof faqSchema>;

export const EventFAQForm = ({ initialData, eventId }: EventFAQFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedFAQs, setExpandedFAQs] = useState<Record<number, boolean>>({});

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      faqs:
        initialData?.faqs?.length > 0
          ? initialData.faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            }))
          : [{ question: "", answer: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const {
    register,
    formState: { errors, isValid },
  } = form;

  const addFAQ = () => {
    append({ question: "", answer: "" });
  };

  const removeFAQ = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      // set empty array if only one FAQ is left
      form.setValue("faqs", []);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      // Filter out empty FAQs
      const validFAQs = values.faqs
        .filter(
          (faq) =>
            faq.question.trim().length > 0 && faq.answer.trim().length > 0
        )
        .map((faq) => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }));

      await updateEvent({
        eventId,
        values: { faqs: validFAQs },
        toggleEdit,
        setLoading,
        router,
      });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          Frequently Asked Questions
          <span className="text-gray-400 text-sm font-normal">(Optional)</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit FAQs
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {initialData.faqs && initialData.faqs.length > 0 ? (
            <div className="space-y-3">
              {initialData.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {expandedFAQs[index] ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  {expandedFAQs[index] && (
                    <div className="px-4 pb-3 border-t bg-gray-50">
                      <p className="text-gray-700 pt-3 whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic flex items-center gap-2">
              No FAQs added yet
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">FAQ {index + 1}</h4>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Question */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Question <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter the frequently asked question"
                      {...register(`faqs.${index}.question`)}
                    />
                    {errors.faqs?.[index]?.question && (
                      <div className="text-red-500 text-sm">
                        {errors.faqs[index]?.question?.message}
                      </div>
                    )}
                  </div>

                  {/* Answer */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Answer <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Provide a clear and helpful answer"
                      rows={4}
                      {...register(`faqs.${index}.answer`)}
                    />
                    {errors.faqs?.[index]?.answer && (
                      <div className="text-red-500 text-sm">
                        {errors.faqs[index]?.answer?.message}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      You can use line breaks to format your answer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add FAQ Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addFAQ}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another FAQ
          </Button>

          {/* Form Actions */}
          <div className="flex items-center gap-x-2 pt-4">
            <Button disabled={!isValid || loading} type="submit">
              {loading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                "Save FAQs"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
