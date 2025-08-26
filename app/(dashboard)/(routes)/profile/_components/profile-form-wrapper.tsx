// @ts-nocheck
"use client";

import RequiredFieldText from "@/components/common/requiredFieldText";
import { useState } from "react";
import toast from "react-hot-toast";
import { Urls } from "@/constants/urls";
import { PersonalInfoForm } from "./personal-info-form";
import { ContactInfoForm } from "./contact-info-form";
import { TeacherInfoForm } from "./teacher-info-form";
import { ResetProfileUserPass } from "./reset-profile-user-pass";

interface ProfileClientProps {
  initialProfileData: any;
  initialCategories: any[];
  userId: string;
}

// Update user profile data on the server
const updateUserProfile = async (userId: string, data: any) => {
  const response = await fetch(Urls.user.profile(userId), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
};

// Fetch user profile data from the server (for updates)
const fetchUserProfile = async (userId: string) => {
  const response = await fetch(Urls.user.profile(userId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
};

const handleApiError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "An error occurred";
  toast.error(message);
};

export default function ProfileFormWrapper({
  initialProfileData,
  initialCategories,
  userId,
}: ProfileClientProps) {
  const [isSubmitting, setIsSubmitting] = useState({
    form: "",
    submitted: false,
  });
  const [formData, setFormData] = useState(initialProfileData);
  const [teacherFormData, setTeacherFormData] = useState(
    initialProfileData.teacherProfile || {}
  );
  const [categories] = useState(initialCategories);

  const refreshProfileData = async () => {
    try {
      const profileData = await fetchUserProfile(userId);
      setFormData(profileData);
      setTeacherFormData(profileData.teacherProfile || {});
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSubmit = async (data: any, formType: string) => {
    setIsSubmitting({ form: formType, submitted: true });
    try {
      await updateUserProfile(userId, data);
      toast.success("Profile updated successfully!");
      await refreshProfileData();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting({ form: "", submitted: false });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <RequiredFieldText className="mb-1 text-gray-500 font-normal" />

        {/* Personal information form */}
        <PersonalInfoForm
          onSubmit={(data) => handleSubmit(data, "personal")}
          defaultValues={formData}
          isLoading={false} // No initial loading since data is pre-fetched
          isSubmitting={isSubmitting}
        />

        {/* Contact information form */}
        <ContactInfoForm
          onSubmit={(data) => handleSubmit(data, "contact")}
          defaultValues={formData}
          isLoading={false}
          isSubmitting={isSubmitting}
        />

        {/* Teacher form - only show if verified */}
        {formData?.teacherProfile &&
          formData?.teacherProfile?.teacherStatus.toLowerCase() ===
            "verified" && (
            <TeacherInfoForm
              onSubmit={(data) => handleSubmit(data, "teacher")}
              defaultValues={teacherFormData}
              categories={categories}
              isLoading={false}
              isSubmitting={isSubmitting}
            />
          )}

        {/* Reset password section if password is available */}
        {formData?.hasPassword && <ResetProfileUserPass />}
      </div>
    </div>
  );
}
