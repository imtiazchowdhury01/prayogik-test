"use client";

import { Certification } from "@prisma/client";
import { RichTextForm } from "./text-editor";

interface CertificationExcerptFormProps {
  initialData: Certification;
  certificationId: string;
  api: string;
}

export const CertificationWhoForForm = ({
  initialData,
  certificationId,
  api,
}: CertificationExcerptFormProps) => {
  return (
    <RichTextForm
      initialValue={initialData?.whofor || ""}
      entityId={certificationId}
      fieldName="whofor"
      label="For Whom"
      placeholder="No data provided"
      isRequired={false}
      maxPreviewLength={800}
      api={api}
      successMessage="updated successfully!"
      errorMessage="Failed to update"
      minLength={0}
    />
  );
};
