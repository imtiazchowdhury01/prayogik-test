"use client";

import { Certification } from "@prisma/client";
import { RichTextForm } from "./text-editor";

interface CertificationExcerptFormProps {
  initialData: Certification;
  certificationId: string;
  api:string
}

export const CertificationExcerptForm = ({
  initialData,
  certificationId,
  api
}: CertificationExcerptFormProps) => {
  return (
    <RichTextForm
      initialValue={initialData?.excerpt || ""}
      entityId={certificationId}
      fieldName="excerpt"
      label="Excerpt"
      placeholder="No excerpt provided"
      isRequired={false}
      maxPreviewLength={800}
      api={api}
      successMessage="Certification excerpt updated successfully!"
      errorMessage="Failed to update certification excerpt"
      minLength={0}
    />
  );
};