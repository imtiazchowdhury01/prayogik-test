// @ts-nocheck
"use client";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader, User, SquarePen, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import EducationsInput from "../../../../../components/EducationsInput";
import UserAvatar from "./avatar";
import { generalSchema } from "./schema";
import DisplayMode from "./display-mode";

interface PersonalInfoFormProps {
  onSubmit: (data: any) => Promise<void>; // Changed to Promise
  defaultValues: any;
  isLoading: boolean;
  isSubmitting: boolean;
  parsedEducation: Array<{
    degree: string;
    major: string;
    passingYear: string;
  }>;
  onSaveComplete?: () => void; // Optional callback for when save is complete
}

export const PersonalInfoForm = ({
  onSubmit,
  defaultValues,
  isLoading,
  isSubmitting,
  parsedEducation,
  onSaveComplete,
}: PersonalInfoFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">(
    "idle"
  );

  const personalInfoForm = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      ...defaultValues,
      education: parsedEducation,
    },
  });

  const {
    watch,
    formState: { errors: personalInfoErrors, isDirty: isPersonalInfoDirty },
    reset: resetPersonalInfo,
  } = personalInfoForm;

  const formValues = watch();

  const onSubmitHandler = async (data: any) => {
    console.log("data result:", data);
    // Convert education array from objects to strings before submitting
    const formattedData = {
      ...data,
      education: data.education.map((edu: any) => {
        return `${edu.degree || ""} - ${edu.major || ""} - ${
          edu.passingYear || ""
        }`;
      }),
    };

    try {
      setSaveStatus("saving");
      await onSubmit(formattedData);
      setSaveStatus("success");

      // If parent provides a callback for when save is complete
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSaveStatus("idle");
    }
  };

  // Watch for success status to close edit mode
  useEffect(() => {
    if (saveStatus === "success") {
      // Reset form with new values
      resetPersonalInfo({
        ...formValues,
        education: parsedEducation,
      });

      // Close edit mode
      setIsEditMode(false);

      // Reset save status
      setSaveStatus("idle");
    }
  }, [saveStatus]);

  const handleCancel = () => {
    resetPersonalInfo(defaultValues);
    setIsEditMode(false);
    setSaveStatus("idle");
  };

  useEffect(() => {
    if (defaultValues) {
      const transformedValues = {
        ...defaultValues,
        name: defaultValues?.name || "",
        email: defaultValues?.email || "",
        dateOfBirth: defaultValues?.dateOfBirth
          ? new Date(defaultValues.dateOfBirth)
          : undefined,
        nationality: defaultValues.nationality || "",
        bio: defaultValues.bio || "",
        education: parsedEducation || [],
        gender: defaultValues.gender || "",
        phoneNumber: defaultValues.phoneNumber || "",
      };

      resetPersonalInfo(transformedValues);
    }
  }, [JSON.stringify(defaultValues), JSON.stringify(parsedEducation)]);

  // Display
  const personalFields = [
    { label: "নাম", value: formValues.name },
    { label: "ইমেইল", value: defaultValues?.email, type: "email" },
    { label: "ফোন নম্বর", value: formValues?.phoneNumber, type: "phone" },
    { label: "জন্ম তারিখ", value: formValues.dateOfBirth, type: "date" },
    { label: "লিঙ্গ", value: formValues.gender, type: "gender" },
    {
      label: "বায়ো",
      value: formValues.bio,
      type: "bio",
      className: "md:col-span-2 pb-4",
    },
  ];

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

  return (
    <div className="bg-white border p-6 rounded-lg shadow-md">
      <div className="flex items-start gap-4 justify-between mb-10">
        <div className="flex items-center gap-2 text-lg ">
          <User className="w-5 h-5 text-brand" />
          <h1 className="text-lg font-bold">ব্যক্তিগত তথ্য</h1>
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
              form="personal-info-form"
              disabled={!isPersonalInfoDirty || saveStatus !== "idle"}
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
        <DisplayMode fields={personalFields} layout="grid" className="mt-6" />
      ) : (
        <FormProvider {...personalInfoForm}>
          <form
            id="personal-info-form"
            onSubmit={personalInfoForm.handleSubmit(onSubmitHandler)}
            className="space-y-8"
          >
            {/* Your form fields remain the same */}
            {/* Name & Email */}
            <div className="flex gap-4 items-center mt-6 max-md:flex-wrap">
              {/* Name */}
              <div className="w-full">
                <FormField
                  control={personalInfoForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>
                        <RequiredFieldStar labelText="নাম" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage>
                        {personalInfoErrors.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              {/* Email */}
              <div className="w-full">
                <div>
                  <RequiredFieldStar labelText="ইমেইল " />
                  <div className="text-sm border border-input rounded-md bg-gray-100 h-[38px] w-full px-3 py-2 cursor-not-allowed">
                    {defaultValues?.email || ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="flex gap-4 mt-4 max-md:flex-wrap">
              <div className="w-full">
                <FormField
                  control={personalInfoForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFieldStar labelText="ফোন নম্বর" />
                      <FormControl>
                        <Input placeholder="ফোন নম্বর" {...field} />
                      </FormControl>
                      <FormMessage>
                        {personalInfoErrors.phoneNumber?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              {/* Date of Birth */}
              <div className="w-full">
                <FormField
                  control={personalInfoForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFieldStar labelText={"জন্ম তারিখ"} />
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left border"
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "তারিখ নির্বাচন করুন"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ?? null}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              captionLayout="dropdown-buttons"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              defaultMonth={field.value || new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage>
                        {personalInfoErrors.dateOfBirth?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Gender */}
            <div className="w-full">
              <FormField
                control={personalInfoForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <RequiredFieldStar labelText={"লিঙ্গ"} />
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">পুরুষ</SelectItem>
                          <SelectItem value="FEMALE">মহিলা</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>
                      {personalInfoErrors.gender?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            {/* Bio */}
            <div className="flex gap-4 mt-4 max-md:flex-wrap">
              <div className="w-full">
                <FormField
                  control={personalInfoForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredFieldStar labelText="বায়ো" />
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          className="resize-none"
                          placeholder="আপনার সম্পর্কে সংক্ষেপে কিছু বলুন"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {personalInfoErrors.bio?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};
