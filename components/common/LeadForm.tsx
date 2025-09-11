"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  leadFormSchema,
  LeadFormValues,
} from "@/app/(site)/leads/_schema/leads";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { LeadStatus } from "@prisma/client";
import RequiredFieldStar from "./requiredFieldStar";

interface LeadFormProps {
  initialData?: Partial<LeadFormValues>;
  courseId?: string;
  eventId?: string;
  certificationId?: string;
  type?: string;
  status?: LeadStatus;
  isPreviewMode?: boolean;
  userInfo?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    profession?: string;
    facebook?: string;
    linkedin?: string;
  };
  isUserRegistered?: boolean;
  userInfoLoading?: boolean;
  submitHandler: (formData: LeadFormValues) => Promise<void>;
}

export function LeadForm({
  initialData,
  courseId,
  eventId,
  certificationId,
  type,
  status = LeadStatus.WAITING,
  isPreviewMode = false,
  userInfo,
  isUserRegistered = false,
  userInfoLoading = false,
  submitHandler,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      facebookProfile: "",
      linkedin: "",
      whatsapp: "",
      courseId: courseId || "",
      eventId: eventId || "",
      certificationId: certificationId || "",
    },
  });

  // Use useEffect to set form values from initialData or userInfo
  React.useEffect(() => {
    // Set values from initialData if available
    if (initialData) {
      if (initialData.name) setValue("name", initialData.name);
      if (initialData.email) setValue("email", initialData.email);
      if (initialData.phone) setValue("phone", initialData.phone);
      if (initialData.facebookProfile)
        setValue("facebookProfile", initialData.facebookProfile);
      if (initialData.linkedin) setValue("linkedin", initialData.linkedin);
      if (initialData.whatsapp) setValue("whatsapp", initialData.whatsapp);
      if (initialData.courseId) setValue("courseId", initialData.courseId);
      if (initialData.eventId) setValue("eventId", initialData.eventId);
      if (initialData.certificationId)
        setValue("certificationId", initialData.certificationId);
    }

    // Set values from userInfo if available (and not already set by initialData)
    if (userInfo) {
      if (userInfo.name && !initialData?.name) setValue("name", userInfo.name);
      if (userInfo.email && !initialData?.email)
        setValue("email", userInfo.email);
      if (userInfo.phoneNumber && !initialData?.phone)
        setValue("phone", userInfo.phoneNumber);
      if (userInfo.facebook && !initialData?.facebookProfile)
        setValue("facebookProfile", userInfo.facebook);
      if (userInfo.linkedin && !initialData?.linkedin)
        setValue("linkedin", userInfo.linkedin);
    }

    // Set course/event/certification IDs
    if (courseId && !initialData?.courseId) setValue("courseId", courseId);
    if (eventId && !initialData?.eventId) setValue("eventId", eventId);
    if (certificationId && !initialData?.certificationId)
      setValue("certificationId", certificationId);
  }, [initialData, userInfo, courseId, eventId, certificationId, setValue]);

  const onSubmit = async (data: LeadFormValues) => {
    // try {
    //   setIsSubmitting(true);

    //   // Build search params
    //   const searchParams = new URLSearchParams();
    //   if (type) searchParams.append("type", type);
    //   if (courseId) searchParams.append("courseId", courseId);
    //   if (eventId) searchParams.append("eventId", eventId);
    //   if (certificationId)
    //     searchParams.append("certificationId", certificationId);
    //   if (status) searchParams.append("status", status);

    //   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/lead${
    //     searchParams.toString() ? `?${searchParams.toString()}` : ""
    //   }`;

    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   const result = await response.json();

    //   if (!response.ok) {
    //     throw new Error(result.message || "কিছু ভুল হয়েছে।");
    //   }

    //   toast.success(
    //     result.message ||
    //       "আপনি সফলভাবে ওয়েটিং লিস্টে রেজিস্ট্রেশন করেছেন। পরবর্তী আপডেট আমরা আপনাকে ইমেইলের মাধ্যমে জানিয়ে দেব।"
    //   );
    //   reset();
    // } catch (error) {
    //   const errorMessage =
    //     error instanceof Error
    //       ? error.message
    //       : "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
    //   toast.error(errorMessage);
    //   console.error("Error submitting form:", error);
    // } finally {
    //   setIsSubmitting(false);
    // }

    try {
      setIsSubmitting(true);
      await submitHandler(data);
      reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log(err, "submitting err");
      })}
      className="space-y-4"
    >
      {/* Only show name field if user is not logged in */}
      {!userInfo?.name && (
        <div>
          <RequiredFieldStar
            labelText="আপনার পূর্ণ নাম"
            className="text-sm font-medium text-gray-700 mb-1 block"
          />
          <Input
            id="name"
            type="text"
            placeholder="আপনার পূর্ণ নাম লিখুন"
            {...register("name", { required: "নাম প্রয়োজন" })}
            className="w-full placeholder:text-gray-400"
            disabled={isSubmitting || isPreviewMode}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
      )}

      {/* Show logged in user's name (read-only) */}
      {userInfo?.name && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1 block">
            আপনার নাম
          </Label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            {userInfo.name}
          </div>
        </div>
      )}

      {/* Only show email field if user is not logged in */}
      {!userInfo?.email && (
        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            <RequiredFieldStar
              labelText="ইমেইল"
              className="text-sm font-medium text-gray-700 mb-1 block"
            />
          </Label>

          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="ইমেইল ঠিকানা লিখুন"
              {...register("email", {
                required: "ইমেইল প্রয়োজন",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "সঠিক ইমেইল ঠিকানা লিখুন",
                },
              })}
              className="w-full placeholder:text-gray-400"
              disabled={isSubmitting || isPreviewMode}
            />
            {emailCheckLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader size={16} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      )}

      {/* Show logged in user's email (read-only) */}
      {userInfo?.email && (
        <div>
          <RequiredFieldStar
            labelText="ইমেইল"
            className="text-sm font-medium text-gray-700 mb-1 block"
          />
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            {userInfo.email}
          </div>
        </div>
      )}

      <div>
        <RequiredFieldStar
          labelText="ফোন নম্বর"
          className="text-sm font-medium text-gray-700 mb-1 block"
        />
        <Input
          id="phone"
          type="tel"
          placeholder="ফোন নম্বার লিখুন"
          {...register("phone", {
            required: "ফোন নম্বার প্রয়োজন",
            pattern: {
              value: /^[0-9]{11}$/,
              message: "১১ সংখ্যার ফোন নম্বার লিখুন",
            },
          })}
          className="w-full placeholder:text-gray-400"
          disabled={isSubmitting || isPreviewMode}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(
              /[^0-9]/g,
              ""
            );
          }}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="facebookProfile"
          className="text-sm font-medium text-gray-700 mb-1 block"
        >
          ফেসবুক প্রোফাইল
        </Label>
        <Input
          id="facebookProfile"
          type="url"
          placeholder="https://facebook.com/yourusername"
          {...register("facebookProfile")}
          className="w-full placeholder:text-gray-400"
          disabled={isSubmitting || isPreviewMode}
        />
        {errors.facebookProfile && (
          <p className="text-red-500 text-sm mt-1">
            {errors.facebookProfile.message}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="linkedin"
          className="text-sm font-medium text-gray-700 mb-1 block"
        >
          লিংকডইন প্রোফাইল
        </Label>
        <Input
          id="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/yourusername"
          {...register("linkedin")}
          className="w-full placeholder:text-gray-400"
          disabled={isSubmitting || isPreviewMode}
        />
        {errors.linkedin && (
          <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="whatsapp"
          className="text-sm font-medium text-gray-700 mb-1 block"
        >
          হোয়াটস অ্যাপ নম্বার
        </Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="018XXXXXXXX"
          {...register("whatsapp", {
            pattern: {
              value: /^[0-9]{11}$/,
              message: "১১ সংখ্যার নম্বার লিখুন",
            },
          })}
          className="w-full placeholder:text-gray-400"
          disabled={isSubmitting || isPreviewMode}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(
              /[^0-9]/g,
              ""
            );
          }}
        />
        {errors.whatsapp && (
          <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          isPreviewMode ||
          isSubmitting ||
          isUserRegistered ||
          emailCheckLoading ||
          userInfoLoading
        }
        className={`w-full font-medium py-3 rounded-md transition-colors disabled:opacity-50 ${
          isUserRegistered
            ? buttonVariants({
                variant: "disabled",
              })
            : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
      >
        {emailCheckLoading || isSubmitting || userInfoLoading ? (
          <Loader size={16} className="animate-spin" />
        ) : isUserRegistered ? (
          "রেজিস্ট্রার্ড"
        ) : (
          "সাবমিট করুন"
        )}
      </Button>
    </form>
  );
}
