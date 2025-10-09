import { CertificationActions } from "./certification-action-form";

interface CourseHeaderProps {
  certificationId: string;
  completionText: string;
  isComplete: boolean;
  isPublished: boolean;
  isAdmin: boolean;
  isCertificationAuthor: boolean;
  certificationSlug: string;
}

export const CertificationHeader = ({
  certificationId,
  completionText,
  isComplete,
  isPublished,
  isAdmin,
  isCertificationAuthor,
  certificationSlug,
}: CourseHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Certification setup</h1>
        <span className="text-sm text-slate-700">
          Complete all required fields {completionText}
        </span>
      </div>
      <CertificationActions
        disabled={!isComplete}
        certificationId={certificationId}
        isPublished={isPublished}
        isAdmin={isAdmin}
        isCertificationAuthor={isCertificationAuthor}
        certificationSlug={certificationSlug}
      />
    </div>
  );
};
