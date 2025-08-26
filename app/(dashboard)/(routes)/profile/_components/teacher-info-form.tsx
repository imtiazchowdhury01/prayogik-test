// @ts-nocheck

"use client";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import ProfileFormSkeleton from "../../profile/_components/profile-form-skeleton";
import { teacherFormSchema } from "./schema";
import toast from "react-hot-toast";

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
  isLoading,
  isSubmitting,
}: TeacherInfoFormProps) => {
  const [inputCertificateUrl, setInputCertificateUrl] = useState("");

  const teacherInfoForm = useForm({
    resolver: zodResolver(teacherFormSchema),
    defaultValues,
  });

  const {
    formState: { errors: teacherInfoErrors, isDirty: isTeacherInfoDirty },
    reset: resetTeacherInfo,
  } = teacherInfoForm;

  const [certificates, setCertificates] = useState<string[]>(
    defaultValues.certifications || []
  );

  // Custom URL validation function
  const isValidUrl = (url: string) => {
    try {
      let temp = new URL(url); // Use the browser's built-in URL parser

      if (certificates.some((cert) => cert === url)) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  // Handle certificate change
  const handleCertificateChange = (value: string) => {
    if (value.endsWith(",")) {
      const newCert = value.slice(0, -1).trim(); // Remove comma and trim whitespace

      if (newCert) {
        if (isValidUrl(newCert)) {
          const updatedCertificates = [...certificates, newCert];
          setCertificates(updatedCertificates);
          teacherInfoForm.setValue("certifications", updatedCertificates, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          console.error("Invalid URL:", newCert); // Debugging log
          toast.error(
            "Invalid URL format or already exist in the list. Please enter a valid URL."
          );
        }
      }

      setInputCertificateUrl(""); // Reset the input field after a comma
    } else {
      setInputCertificateUrl(value); // Update input field as user types
    }
  };

  // Remove certificate by index
  const removeCertificate = (index: number) => {
    const updatedCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(updatedCertificates);
    teacherInfoForm.setValue("certifications", updatedCertificates, {
      shouldDirty: true,
    }); // Update form state and mark as dirty
  };

  // Reset form with defaultValues when they change
  useEffect(() => {
    if (defaultValues) {
      resetTeacherInfo(defaultValues);
      setCertificates(defaultValues.certifications || []); // Reset certificates state
    }
  }, [defaultValues, resetTeacherInfo]);

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold">Teaching Information</h1>
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
                        <RequiredFieldStar labelText="Specialized Area" />
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
                          placeholder="Select skills"
                        />
                      </FormControl>
                      <FormMessage>
                        {teacherInfoErrors.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          {/* expertiseLevel */}
          <div className="flex gap-4 mt-4">
            <div className="w-full">
              <div className="w-full">
                <FormField
                  control={teacherInfoForm.control}
                  name="expertiseLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredFieldStar labelText=" Expertise Level" />
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
                        {teacherInfoErrors.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          {/* yearsOfExperience */}
          <div className="flex gap-4 mt-4">
            <FormField
              control={teacherInfoForm.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Years of Experience" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-1 year">0-1 year</SelectItem>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="2-4 years">2-4 years</SelectItem>
                      <SelectItem value="4-6 years">4-6 years</SelectItem>
                      <SelectItem value="6-10 years">6-10 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{teacherInfoErrors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          {/* certifications */}
          <div className="flex gap-4 mt-4">
            <div className="w-full">
              <FormField
                name="certifications"
                control={teacherInfoForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Certifications"
                        value={inputCertificateUrl}
                        onChange={(e) =>
                          handleCertificateChange(e.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Write certifications with "," as separator
                    </FormDescription>
                    <FormMessage>
                      {teacherInfoErrors.certifications?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Display certificates with delete option */}
          <div className="flex flex-wrap gap-2 mt-2">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded text-sm"
              >
                <span>{cert}</span>
                <button
                  type="button"
                  onClick={() => removeCertificate(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
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
