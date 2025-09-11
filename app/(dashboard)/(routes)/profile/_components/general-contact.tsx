//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Input } from "@/components/ui/input";
import { Loader, MapPin, SquarePen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import DisplayMode from "./display-mode";

const GeneralContact = ({
  defaultValues,
  contactInfoForm,
  contactInfoErrors,
  isGeneralInfoDirty,
  resetContactInfo,
  isSubmitting,
  onSubmit,
}: any) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">(
    "idle"
  );
  const formValues = contactInfoForm.watch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveStatus("saving");
      await onSubmit();
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving general contact:", error);
      setSaveStatus("idle");
    }
  };

  // Watch for success status to close edit mode
  useEffect(() => {
    if (saveStatus === "success") {
      // Close edit mode after a short delay to show success state
      const timer = setTimeout(() => {
        setIsEditMode(false);
        setSaveStatus("idle");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleCancel = () => {
    resetContactInfo(defaultValues);
    setIsEditMode(false);
    setSaveStatus("idle");
  };

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
            <Loader className="animate-spin h-4 w-4" />
            Saving...
          </div>
        );
      default:
        return "Save";
    }
  };

  // Display
  const addressFields = [
    { label: "শহর", value: formValues.city },
    { label: "বিভাগ", value: formValues.state },
    { label: "পোস্ট কোড", value: formValues.zipCode },
    { label: "দেশ", value: formValues.country },
  ];

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-brand" />
          <h1 className="text-lg font-bold ">লোকেশন</h1>
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
              form="contact-info-form"
              disabled={!isGeneralInfoDirty || saveStatus !== "idle"}
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
        <DisplayMode fields={addressFields} layout="single" />
      ) : (
        <form id="contact-info-form" onSubmit={handleSubmit}>
          {/* Phone & City */}
          <div className="flex gap-4 mt-4 max-md:flex-wrap flex-col">
            {/* Phone */}
            {/* <div className="w-full">
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
            </div> */}
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
          <div className="flex gap-4 mt-4 max-md:flex-wrap flex-col">
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
          </div>
        </form>
      )}
    </div>
  );
};

export default GeneralContact;
