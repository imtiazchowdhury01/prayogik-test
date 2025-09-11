// @ts-nocheck
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { contactSchema } from "./schema";

import SocialContact from "./social-contact";
import GeneralContact from "./general-contact";
import { PersonalInfoForm } from "./personal-info-form";
import { TeacherInfoForm } from "./teacher-info-form";

interface ContactInfoFormProps {
  onSubmit: (data: any) => void;
  defaultValues: any;
  isLoading: boolean;
  isSubmitting: boolean;
  formData: any;
  parsedEducation: any;
  handleSubmit: (data: any, type: string) => void;
  teacherFormData: any;
  categories: any;
}

export const ProfileInfoForm = ({
  onSubmit,
  defaultValues,
  isSubmitting,
  formData,
  parsedEducation,
  handleSubmit,
  teacherFormData,
  categories,
}: ContactInfoFormProps) => {
  const contactInfoForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const {
    formState: { errors: contactInfoErrors, dirtyFields },
    reset: resetContactInfo,
  } = contactInfoForm;

  // Field groups for dirty checking
  const fieldGroups = {
    general: ["city", "state", "country", "zipCode"],
    social: ["facebook", "linkedin", "twitter", "youtube", "website", "others"],
  };

  const isDirty = (fields: string[]) =>
    fields.some((field) => dirtyFields[field]);
  const isGeneralInfoDirty = isDirty(fieldGroups.general);
  const isSocialInfoDirty = isDirty(fieldGroups.social);

  useEffect(() => {
    if (defaultValues) {
      const transformedValues = {
        ...defaultValues,
        dateOfBirth: defaultValues.dateOfBirth
          ? new Date(defaultValues.dateOfBirth)
          : undefined,
        ...Object.fromEntries(
          [...fieldGroups.general, ...fieldGroups.social].map((field) => [
            field,
            defaultValues?.[field] || "",
          ])
        ),
      };
      resetContactInfo(transformedValues);
    }
  }, [defaultValues, resetContactInfo]);

  // Generic submit handler
  const createSubmitHandler = (fields: string[]) => () => {
    const currentValues = contactInfoForm.getValues();
    const data = Object.fromEntries(
      fields.map((field) => [field, currentValues[field]])
    );
    onSubmit(data);
  };

  const isTeacherVerified =
    formData?.teacherProfile?.teacherStatus?.toLowerCase() === "verified";

  return (
    <div className="mt-8">
      <FormProvider {...contactInfoForm}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={!isTeacherVerified ? "lg:col-span-2" : ""}>
            <PersonalInfoForm
              onSubmit={(data) => handleSubmit(data, "personal")}
              defaultValues={formData}
              isLoading={false}
              isSubmitting={isSubmitting}
              parsedEducation={parsedEducation}
            />
          </div>

          <SocialContact
            contactInfoErrors={contactInfoErrors}
            contactInfoForm={contactInfoForm}
            defaultValues={defaultValues}
            isSocialInfoDirty={isSocialInfoDirty}
            resetContactInfo={resetContactInfo}
            isSubmitting={isSubmitting}
            onSubmit={createSubmitHandler(fieldGroups.social)}
          />
          <GeneralContact
            contactInfoErrors={contactInfoErrors}
            contactInfoForm={contactInfoForm}
            defaultValues={defaultValues}
            isGeneralInfoDirty={isGeneralInfoDirty}
            resetContactInfo={resetContactInfo}
            isSubmitting={isSubmitting}
            onSubmit={createSubmitHandler(fieldGroups.general)}
          />

          {isTeacherVerified && (
            <TeacherInfoForm
              onSubmit={(data) => handleSubmit(data, "teacher")}
              defaultValues={teacherFormData}
              categories={categories}
              isLoading={false}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </FormProvider>
    </div>
  );
};
