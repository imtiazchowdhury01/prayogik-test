//@ts-nocheck
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
import {
  Globe,
  Loader,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  SquarePen,
  X,
  Check,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const SocialContact = ({
  defaultValues,
  contactInfoForm,
  contactInfoErrors,
  isSocialInfoDirty,
  resetContactInfo,
  isSubmitting,
  onSubmit, // New prop for handling submission
}: any) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">(
    "idle"
  );

  const socialLinks = [
    {
      name: "linkedin",
      label: "LinkedIn",
      bengaliLabel: "লিঙ্কডইন",
      icon: Linkedin,
      placeholder: "প্রোফাইল লিংক",
      required: true,
      color: "text-brand",
    },
    {
      name: "facebook",
      label: "Facebook",
      bengaliLabel: "ফেসবুক",
      icon: Facebook,
      placeholder: "প্রোফাইল লিংক",
      required: false,
      color: "text-brand",
    },
    {
      name: "twitter",
      label: "Twitter",
      bengaliLabel: "টুইটার(X)",
      icon: Twitter,
      placeholder: "প্রোফাইল লিংক",
      required: false,
      color: "text-brand",
    },
    {
      name: "youtube",
      label: "YouTube",
      bengaliLabel: "ইউটিউব",
      icon: Youtube,
      placeholder: "চ্যানেল লিংক",
      required: false,
      color: "text-brand",
    },
    {
      name: "website",
      label: "Website",
      bengaliLabel: "ওয়েবসাইট",
      icon: Globe,
      placeholder: "ওয়েবসাইট লিংক",
      required: false,
      color: "text-brand",
    },
    {
      name: "others",
      label: "Others",
      bengaliLabel: "অন্যান্য",
      icon: Globe,
      placeholder: "অন্যান্য লিংক",
      required: false,
      color: "text-brand",
    },
  ];

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    resetContactInfo(defaultValues);
    setSaveStatus("idle");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveStatus("saving");
      await onSubmit(); // Call the parent's submit handler
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving social contact:", error);
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

  const getFieldValue = (fieldName: string) => {
    return contactInfoForm.getValues(fieldName) || "";
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

  if (!isEditMode) {
  const socialLinksWithValues = socialLinks.filter((social) => {
  const value = getFieldValue(social.name);
  return value && value.trim() !== '';
});

    // Display Mode
    return (
      <div className="bg-white p-6 border rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold">সোশ্যাল</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center text-sm gap-1 text-gray-600 p-0 border-0 hover:bg-transparent hover:text-brand"
          >
            <SquarePen className="w-4 h-4" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          {socialLinksWithValues?.length > 0 ? (
            socialLinks.map((social) => {
              const value = getFieldValue(social.name);
              if (!value) return null;

              const IconComponent = social.icon;
              return (
                <div
                  key={social.name}
                  className="flex flex-col items-start gap-x-3"
                >
                  <div className="flex gap-2">
                    <IconComponent className={`w-4 h-4 ${social.color}`} />
                    <div className="text-sm text-gray-600 font-normal">
                      {social.label}
                    </div>
                  </div>
                  <div>
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:text-brand hover:underline text-sm"
                    >
                      {value}
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400">
              কোনো সোশ্যাল লিংক দেওয়া হয়নি
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <form onSubmit={handleSave}>
      <div className="bg-white p-6 border rounded-lg shadow-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">সোশ্যাল</h2>
          </div>
          <div className="flex items-center gap-2">
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
              disabled={!isSocialInfoDirty || saveStatus !== "idle"}
              className={`${
                saveStatus === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-brand hover:bg-teal-700"
              } disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors`}
            >
              {getButtonContent()}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <FormField
                key={social.name}
                control={contactInfoForm.control}
                name={social.name}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className={`w-4 h-4 ${social.color}`} />
                      {social.required ? (
                        <RequiredFieldStar labelText={social.label} />
                      ) : (
                        <FormLabel className="text-sm font-medium text-gray-700">
                          {social.label}
                        </FormLabel>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        placeholder={social.placeholder}
                        {...field}
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage>
                      {contactInfoErrors[social.name]?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default SocialContact;
