// _components/course-left-sidebar.tsx
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard } from "lucide-react";
import { TitleForm } from "./title-form";
import { ImageForm } from "./image-form";
import { SlugTitleForm } from "./slug-title-form";
import { DescriptionForm } from "./description-form";
import { LearningOutcomesForm } from "./learningOutcome-form";
import { CourseRequirementsForm } from "./coureseRequirements-form";
import { CategoryForm } from "./category-form";

interface CourseLeftSidebarProps {
  course: any; // Replace with proper Course type
}

export const CourseLeftSidebar = ({ course }: CourseLeftSidebarProps) => {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={LayoutDashboard} />
        <h2 className="text-xl">Customize your course</h2>
      </div>
      <TitleForm initialData={course} courseId={course.id} />
      <SlugTitleForm initialData={course} courseId={course.id} />
      <DescriptionForm initialData={course} courseId={course.id} />
      <LearningOutcomesForm initialData={course} courseId={course.id} />
      <CourseRequirementsForm initialData={course} courseId={course.id} />
      <ImageForm initialData={course} courseId={course.id} />
      <CategoryForm initialData={course} courseId={course.id} />
    </div>
  );
};
