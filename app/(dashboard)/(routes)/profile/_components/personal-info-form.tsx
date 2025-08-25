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
import { CalendarIcon, Loader } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import EducationsInput from "../../apply-for-teaching/_components/EducationsInput";
import UserAvatar from "./avatar";
import { generalSchema } from "./schema";

interface PersonalInfoFormProps {
  onSubmit: (data: any) => void;
  defaultValues: any;
  isLoading: boolean;
  isSubmitting: boolean;
  parsedEducation: Array<{
    degree: string;
    major: string;
    passingYear: string;
  }>;
}

export const PersonalInfoForm = ({
  onSubmit,
  defaultValues,
  isLoading,
  isSubmitting,
  parsedEducation,
}: PersonalInfoFormProps) => {
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

  const onSubmitHandler = (data: any) => {
    // Convert education array from objects to strings before submitting
    const formattedData = {
      ...data,
      education: data.education.map((edu: any) => {
        return `${edu.degree || ""} - ${edu.major || ""} - ${
          edu.passingYear || ""
        }`;
      }),
    };
    onSubmit(formattedData);
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
      };

      resetPersonalInfo(transformedValues);
    }
  }, [JSON.stringify(defaultValues), JSON.stringify(parsedEducation)]);

  return (
    <div className="bg-white border p-6 rounded-lg shadow-md">
      <div className="flex items-start gap-4 justify-between">
        <h1 className="text-2xl font-bold">প্রোফাইল</h1>
      </div>
      <hr className="border-gray-200 my-2" />
      <div className="mt-4">
        <UserAvatar />
      </div>
      <FormProvider {...personalInfoForm}>
        <form
          onSubmit={personalInfoForm.handleSubmit(onSubmitHandler)}
          className="space-y-8"
        >
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
                              date > new Date() || date < new Date("1900-01-01")
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
          </div>

          {/* Nationality */}
          <div className="w-full mt-4">
            <FormField
              control={personalInfoForm.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>জাতীয়তা</FormLabel>
                  <FormControl>
                    <Input placeholder="বাংলাদেশি" {...field} />
                  </FormControl>
                  <FormMessage>
                    {personalInfoErrors.nationality?.message}
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
                      <RequiredFieldStar labelText="জীবনবৃত্তান্ত (বায়ো)" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="আপনার সম্পর্কে সংক্ষেপে কিছু বলুন"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{personalInfoErrors.bio?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Education */}
          <FormField
            name="education"
            control={personalInfoForm.control}
            render={({ field }) => (
              <FormItem>
                {/* <RequiredFieldStar labelText="Education" /> */}
                <FormControl>
                  <EducationsInput
                    initialEducations={field.value || []}
                    onUpdateEducations={(updatedEducations) => {
                      field.onChange(updatedEducations);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            {isPersonalInfoDirty && (
              <Button
                variant="outline"
                onClick={() => resetPersonalInfo(defaultValues)}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={!isPersonalInfoDirty ? "bg-gray-400" : ""}
              disabled={!isPersonalInfoDirty}
            >
              {isPersonalInfoDirty &&
              isSubmitting.form === "personal" &&
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
