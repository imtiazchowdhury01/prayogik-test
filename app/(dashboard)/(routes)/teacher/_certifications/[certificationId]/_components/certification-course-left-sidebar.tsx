// _components/certification-left-sidebar.tsx
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard } from "lucide-react";
import { TitleForm } from "../../../courses/[courseId]/_components/title-form";
import { SlugTitleForm } from "../../../courses/[courseId]/_components/slug-title-form";
import { DescriptionForm } from "../../../courses/[courseId]/_components/description-form";
import { LearningOutcomesForm } from "../../../courses/[courseId]/_components/learningOutcome-form";
import { ImageForm } from "../../../courses/[courseId]/_components/image-form";
import { CertificationCategoryForm } from "./certification-category-form";
import { CertificationExcerptForm } from "./certification-excerpt-form";
import { CertificationWhoForForm } from "./certification-whofor-form";
import { CertificationImageForm } from "./certification-image-form";

interface CourseLeftSidebarProps {
  certification: any; // Replace with proper Course type
}

export const CertificationCourseLeftSidebar = ({
  certification,
}: CourseLeftSidebarProps) => {
  const api = `/api/certifications/${certification?.id}`;
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={LayoutDashboard} />
        <h2 className="text-xl">Customize your certification</h2>
      </div>
      <TitleForm
        initialData={certification}
        courseId={certification.id}
        successMessage="Title Updated Successfully"
        api={api}
      />
      <SlugTitleForm
        initialData={certification}
        courseId={certification.id}
        successMessage="Slug Updated Successfully"
        api={api}
      />
      
      <CertificationExcerptForm
      certificationId={certification?.id}
      initialData={certification}
      api={api}
      />
      <DescriptionForm
        initialData={certification}
        courseId={certification.id}
        successMessage="Description Updated Successfully"
        api={api}
      />
      <LearningOutcomesForm
        initialData={certification}
        courseId={certification.id}
        api={api}
        successMessage="Learning Outcomes Updated Successfully"
      />
      <CertificationImageForm
        initialData={certification}
        certificationId={certification.id}
        api={api}
        successMessage="Image Uploaded successfully"
      />
      <CertificationCategoryForm
        initialData={certification}
        certificationId={certification.id}
      />
    
      <CertificationWhoForForm
      certificationId={certification?.id}
      initialData={certification}
      api={api}
      />
    </div>
  );
};
