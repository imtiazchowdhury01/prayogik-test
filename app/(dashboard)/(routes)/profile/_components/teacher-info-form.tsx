// @ts-nocheck

"use client";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultiSelect from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeacherExpertiseLevel } from "@prisma/client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { teacherFormSchema } from "./schema";
import CertificationsInput from "@/components/CertificationsInput";

export const yearOfExperienceValues = [
  "০-১ বছর",
  "১-২ বছর",
  "২-৪ বছর",
  "৪-৬ বছর",
  "৬-১০ বছর",
  "১০+ বছর",
];

interface TeacherInfoFormProps {
  onSubmit: (data: any) => void;
  defaultValues: any;
  categories: any[];
  isLoading: boolean;
  isSubmitting: boolean;
}

export const TeacherInfoForm = ({
  onSubmit,
  defaultValues,
  categories,
  isSubmitting,
}: TeacherInfoFormProps) => {
  const teacherInfoForm = useForm({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      subjectSpecializations: [],
      expertiseLevel: TeacherExpertiseLevel.ENTRY_LEVEL,
      certifications: [],
      yearsOfExperience: defaultValues?.yearsOfExperience || "",
    },
  });

  const {
    formState: { errors: teacherInfoErrors, isDirty: isTeacherInfoDirty },
    reset: resetTeacherInfo,
  } = teacherInfoForm;

  // Reset form with defaultValues when they change
  useEffect(() => {
    if (defaultValues) {
      // Create a proper defaultValues object with fallbacks
      const formattedDefaultValues = {
        subjectSpecializations: defaultValues.subjectSpecializations || [],
        expertiseLevel:
          defaultValues.expertiseLevel || TeacherExpertiseLevel.ENTRY_LEVEL,
        certifications: defaultValues.certifications || [],
        yearsOfExperience:
          defaultValues.yearsOfExperience || yearOfExperienceValues[0],
      };
      resetTeacherInfo(formattedDefaultValues);
    }
  }, [defaultValues, resetTeacherInfo]);

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold">শিক্ষকতার তথ্য</h1>
      <hr className="border-gray-200 mt-3 mb-6" />
      <FormProvider {...teacherInfoForm}>
        <form
          onSubmit={teacherInfoForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* subjectSpecializations */}
          <div className="flex gap-4 mt-4">
            <div className="w-full">
              <div className="w-full">
                <FormField
                  control={teacherInfoForm.control}
                  name="subjectSpecializations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredFieldStar labelText="বিশেষায়িত ক্ষেত্র" />
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            categories?.map((v) => ({
                              value: v?.name,
                              label: v?.name,
                            })) || []
                          }
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="বিষয় নির্বাচন করুন"
                        />
                      </FormControl>
                      <FormMessage>
                        {teacherInfoErrors.subjectSpecializations?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between md:flex-row flex-col items-center gap-4">
            {/* expertiseLevel */}
            <div className="flex gap-4 mt-4 w-full">
              <div className="w-full">
                <FormField
                  control={teacherInfoForm.control}
                  name="expertiseLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredFieldStar labelText="অভিজ্ঞতার স্তর" />
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <div className="flex gap-4 items-center">
                            {Object.keys(TeacherExpertiseLevel).map((level) => {
                              const banglaLabels = {
                                ENTRY_LEVEL: "নতুন",
                                MID_LEVEL: "মধ্যম",
                                EXPERT: "বিশেষজ্ঞ",
                              };
                              return (
                                <FormItem
                                  key={level}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={level}
                                      label={banglaLabels[level] || level}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {banglaLabels[level] ||
                                      String(level?.split("_")[0])
                                        .charAt(0)
                                        .toUpperCase() +
                                        String(level?.split("_")[0])
                                          .slice(1)
                                          .toLowerCase()}
                                  </FormLabel>
                                </FormItem>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage>
                        {teacherInfoErrors.expertiseLevel?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                {/* yearsOfExperience */}
                <FormField
                  name="yearsOfExperience"
                  control={teacherInfoForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFieldStar labelText="অভিজ্ঞতার বছর" />
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select years of experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1 year">০-১ বছর</SelectItem>
                            <SelectItem value="1-2 years">১-২ বছর</SelectItem>
                            <SelectItem value="2-4 years">২-৪ বছর</SelectItem>
                            <SelectItem value="4-6 years">৪-৬ বছর</SelectItem>
                            <SelectItem value="6-10 years">৬-১০ বছর</SelectItem>
                            <SelectItem value="10+ years">১০+ বছর</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          {/* certifications */}
          <div className="flex gap-4 mt-4 p-4 border rounded-lg bg-gray-50">
            <div className="w-full">
              <FormField
                name="certifications"
                control={teacherInfoForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CertificationsInput
                        initialCertifications={field.value || []}
                        onUpdateCertifications={(updatedCertifications) => {
                          field.onChange(updatedCertifications);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {isTeacherInfoDirty && (
              <Button
                variant="outline"
                onClick={() => resetTeacherInfo(defaultValues)}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={!isTeacherInfoDirty ? "bg-gray-400" : ""}
              disabled={!isTeacherInfoDirty}
            >
              {isTeacherInfoDirty &&
              isSubmitting.form === "teacher" &&
              isSubmitting.submitted ? (
                <div className="flex gap-2 items-center">
                  <Loader className="animate-spin h-4 w-4" />
                  Saving
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
