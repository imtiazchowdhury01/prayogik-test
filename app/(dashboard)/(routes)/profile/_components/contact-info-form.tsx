// @ts-nocheck

"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ProfileFormSkeleton from "../../profile/_components/profile-form-skeleton";
import { contactSchema } from "./schema";
import RequiredFieldText from "@/components/common/requiredFieldText";
import RequiredFieldStar from "@/components/common/requiredFieldStar";

interface ContactInfoFormProps {
  onSubmit: (data: any) => void;
  defaultValues: any;
  isLoading: boolean;
  isSubmitting: boolean;
}

export const ContactInfoForm = ({
  onSubmit,
  defaultValues,
  isLoading,
  isSubmitting,
}: ContactInfoFormProps) => {
  const contactInfoForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const {
    formState: { errors: contactInfoErrors, isDirty: isContactInfoDirty },
    reset: resetContactInfo,
  } = contactInfoForm;

  useEffect(() => {
    if (defaultValues) {
      const transformedValues = {
        ...defaultValues,
        dateOfBirth: defaultValues.dateOfBirth
          ? new Date(defaultValues.dateOfBirth)
          : undefined,
        phoneNumber: defaultValues?.phoneNumber || "",
        city: defaultValues?.city || "",
        state: defaultValues?.state || "",
        country: defaultValues?.country || "",
        zipCode: defaultValues?.zipCode || "",
        facebook: defaultValues?.facebook || "",
        linkedin: defaultValues?.linkedin || "",
        twitter: defaultValues?.twitter || "",
        youtube: defaultValues?.youtube || "",
        website: defaultValues?.website || "",
        others: defaultValues?.others || "",
      };
      resetContactInfo(transformedValues);
    }
  }, [defaultValues, resetContactInfo]);

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold">যোগাযোগ</h1>
      <hr className="border-gray-200 mt-3 mb-6" />
      {/* {isLoading ? null : ( // <ProfileFormSkeleton /> */}
      <FormProvider {...contactInfoForm}>
        <form
          onSubmit={contactInfoForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Phone & City */}
          <div className="flex gap-4 mt-4 max-md:flex-wrap">
            {/* Phone */}
            <div className="w-full">
              <FormField
                control={contactInfoForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <RequiredFieldStar labelText="ফোন নম্বর" />
                    <FormControl>
                      <Input placeholder="ফোন নম্বর" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.phoneNumber?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            {/* City */}
            <div className="w-full">
              <FormField
                control={contactInfoForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>শহর</FormLabel>
                    <FormControl>
                      <Input placeholder="শহর" {...field} />
                    </FormControl>
                    <FormMessage>{contactInfoErrors.city?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* State, Country, Zip Code */}
          <div className="flex gap-4 mt-4 max-md:flex-wrap">
            <div className="w-full">
              {/* State */}
              <FormField
                control={contactInfoForm.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>বিভাগ</FormLabel>
                    <FormControl>
                      <Input placeholder="বিভাগ" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.state?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              {/* Country */}
              <FormField
                control={contactInfoForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>দেশ</FormLabel>
                    <FormControl>
                      <Input placeholder="দেশ" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.country?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              {/* Zip Code */}
              <FormField
                control={contactInfoForm.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পোস্ট কোড</FormLabel>
                    <FormControl>
                      <Input placeholder="পোস্ট কোড" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.zipCode?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4 mt-4 max-md:flex-wrap">
            <div className="w-full">
              {/* Facebook */}
              <FormField
                control={contactInfoForm.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ফেসবুক</FormLabel>
                    <FormControl>
                      <Input placeholder="প্রোফাইল লিংক" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.facebook?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              {/* LinkedIn */}
              <FormField
                control={contactInfoForm.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <RequiredFieldStar labelText="লিঙ্কডইন" />
                    <FormControl>
                      <Input placeholder="প্রোফাইল লিংক" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.linkedin?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Twitter & YouTube */}
          <div className="flex gap-4 mt-4 max-md:flex-wrap">
            <div className="w-full">
              {/* Twitter */}
              <FormField
                control={contactInfoForm.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>টুইটার(X)</FormLabel>
                    <FormControl>
                      <Input placeholder="প্রোফাইল লিংক" {...field} />
                    </FormControl>
                    <FormDescription>Twitter</FormDescription>
                    <FormMessage>
                      {contactInfoErrors.twitter?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              {/* YouTube */}
              <FormField
                control={contactInfoForm.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ইউটিউব</FormLabel>
                    <FormControl>
                      <Input placeholder="চ্যানেল লিংক" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.youtube?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Website & Others */}
          <div className="flex gap-4 mt-4 max-md:flex-wrap">
            <div className="w-full">
              {/* Website */}
              <FormField
                control={contactInfoForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ওয়েবসাইট</FormLabel>
                    <FormControl>
                      <Input placeholder="ওয়েবসাইট লিংক" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.website?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              {/* Others */}
              <FormField
                control={contactInfoForm.control}
                name="others"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>অন্যান্য</FormLabel>
                    <FormControl>
                      <Input placeholder="অন্যান্য লিংক" {...field} />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors.others?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {isContactInfoDirty && (
              <Button
                variant="outline"
                onClick={() => resetContactInfo(defaultValues)}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={!isContactInfoDirty && "bg-gray-400"}
              disabled={!isContactInfoDirty}
            >
              {isContactInfoDirty &&
              isSubmitting.form === "contact" &&
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
      {/* )} */}
    </div>
  );
};
