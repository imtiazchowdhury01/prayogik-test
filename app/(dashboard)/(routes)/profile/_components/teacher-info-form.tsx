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
import { Briefcase, Loader, SquarePen, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { teacherFormSchema } from "./schema";
import CertificationsInput from "@/components/CertificationsInput";
import DisplayMode from "./display-mode";

export const yearOfExperienceValues = [
  "০-১ বছর",
  "১-২ বছর",
  "২-৪ বছর",
  "৪-৬ বছর",
  "৬-১০ বছর",
  "১০+ বছর",
];

interface TeacherInfoFormProps {
  onSubmit: (data: any) => Promise<void>; // Changed to Promise
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">(
    "idle"
  );

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
    watch,
    formState: { errors: teacherInfoErrors, isDirty: isTeacherInfoDirty },
    reset: resetTeacherInfo,
  } = teacherInfoForm;

  const formValues = watch();

  const handleSubmit = async (data: any) => {
    try {
      setSaveStatus("saving");
      await onSubmit(data);
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving teacher info:", error);
      setSaveStatus("idle");
    }
  };

  // Watch for success status to close edit mode
  useEffect(() => {
    if (saveStatus === "success") {
      // Reset form with new values
      resetTeacherInfo(formValues);

      // Close edit mode after a short delay to show success state
      const timer = setTimeout(() => {
        setIsEditMode(false);
        setSaveStatus("idle");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleCancel = () => {
    resetTeacherInfo(defaultValues);
    setIsEditMode(false);
    setSaveStatus("idle");
  };

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

  // Determine button content
  const getButtonContent = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <div className="flex gap-2 items-center">
            <Loader className="animate-spin h-4 w-4" />
            Saving...
          </div>
        );
      case "success":
        return (
          <div className="flex gap-2 items-center">
            <Check className="h-4 w-4" />
            Saved!
          </div>
        );
      default:
        return "Save";
    }
  };

  // Display
  const experienceMapping = {
    "0-1 year": "০-১ বছর",
    "1-2 years": "১-২ বছর",
    "2-4 years": "২-৪ বছর",
    "4-6 years": "৪-৬ বছর",
    "6-10 years": "৬-১০ বছর",
    "10+ years": "১০+ বছর",
  };

  // Update the experienceFields
  const experienceFields = [
    {
      label: "অভিজ্ঞতার বছর",
      value:
        experienceMapping[formValues.yearsOfExperience] ||
        formValues.yearsOfExperience,
      key: "yearsOfExperience",
    },
    {
      label: "এক্সপার্টাইজ",
      value: formValues.subjectSpecializations,
      type: "specializations",
      key: "subjectSpecializations",
    },
  ];
  console.log("experienceFields result:", experienceFields);

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-lg">
          <Briefcase className="w-5 h-5 text-brand" />
          <h2 className="text-lg font-bold">প্রফেশনাল তথ্য</h2>
        </div>
        {!isEditMode ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(true)}
            className="flex items-center text-sm gap-1 text-gray-600 p-0 border-0 hover:bg-transparent hover:text-brand"
          >
            <SquarePen className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={saveStatus === "saving"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              form="teacher-info-form"
              disabled={!isTeacherInfoDirty || saveStatus !== "idle"}
              className={`${
                saveStatus === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-brand hover:bg-teal-700"
              } disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors`}
            >
              {getButtonContent()}
            </Button>
          </div>
        )}
      </div>

      {!isEditMode ? (
        <DisplayMode fields={experienceFields} layout="single" />
      ) : (
        <FormProvider {...teacherInfoForm}>
          <form
            id="teacher-info-form"
            onSubmit={teacherInfoForm.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="flex justify-between md:flex-row flex-col items-center gap-4">
              {/* expertiseLevel */}
              <div className="flex gap-4 mt-4 w-fit">
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
                              <SelectItem value="6-10 years">
                                ৬-১০ বছর
                              </SelectItem>
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
                          <RequiredFieldStar labelText="এক্সপার্টাইজ" />
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
          </form>
        </FormProvider>
      )}
    </div>
  );
};
