// @ts-nocheck
"use client";

import RequiredFieldText from "@/components/common/requiredFieldText";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Urls } from "@/constants/urls";
import { PersonalInfoForm } from "./personal-info-form";
import { ContactInfoForm } from "./contact-info-form";
import { TeacherInfoForm } from "./teacher-info-form";
import { ResetProfileUserPass } from "./reset-profile-user-pass";
import { parseEducationData } from "@/lib/utils/parseEducationData";

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
  const [activeTab, setActiveTab] = useState("account");
  const [isSubmitting, setIsSubmitting] = useState({
    form: "",
    submitted: false,
  });

  const [formData, setFormData] = useState(initialProfileData);
  const [teacherFormData, setTeacherFormData] = useState(
    initialProfileData.teacherProfile || {}
  );
  const [categories] = useState(initialCategories);

  // Parse education data once when component mounts
  const parsedEducation = useMemo(() => {
    return parseEducationData(formData?.education);
  }, [formData?.education]);

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

  const tabs = [
    { id: "account", label: "Account" },
    ...(formData?.hasPassword ? [{ id: "password", label: "Password" }] : []),
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 border-b-2 font-medium text-md ${
                    activeTab === tab.id
                      ? "border-teal-500 text-teal-600 bg-brand/5 rounded-t-lg"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "account" && (
          <>
            <RequiredFieldText className="mb-1 text-gray-500 font-normal" />
            {/* Personal information form */}
            <PersonalInfoForm
              onSubmit={(data) => handleSubmit(data, "personal")}
              defaultValues={formData}
              isLoading={false}
              isSubmitting={isSubmitting}
              parsedEducation={parsedEducation}
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
          </>
        )}

        {activeTab === "password" && formData?.hasPassword && (
          <ResetProfileUserPass />
        )}
      </div>
    </div>
  );
}
