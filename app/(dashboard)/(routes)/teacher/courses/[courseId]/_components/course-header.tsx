// _components/course-header.tsx
import { Actions } from "../_components/actions";

interface CourseHeaderProps {
  courseId: string;
  completionText: string;
  isComplete: boolean;
  isPublished: boolean;
  isAdmin: boolean;
  isCourseAuthor: boolean;
}
    
export const CourseHeader = ({
  courseId,
  completionText,
  isComplete,
  isPublished,
  isAdmin,
  isCourseAuthor,
}: CourseHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Course setup</h1>
        <span className="text-sm text-slate-700">
          Complete all required fields {completionText}
        </span>
      </div>
      <Actions
        disabled={!isComplete}
        courseId={courseId}
        isPublished={isPublished}
        isAdmin={isAdmin}
        isCourseAuthor={isCourseAuthor}
      />
    </div>
  );
};
