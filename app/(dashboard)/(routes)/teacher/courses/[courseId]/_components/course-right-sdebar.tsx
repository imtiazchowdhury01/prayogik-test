import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSign,
  CircleUserRound,
  File,
  ListChecks,
} from "lucide-react";
import { AuthorForm } from "./author-form";
import { CoAuthorForm } from "./co-author-form";
import { CourseModeForm } from "./course-mode-form";
import { LessonsForm } from "./lessons-form";
import { CourseTypeForm } from "./course-type-form";
import { MultiplePriceForm } from "./multiple-price-form";
import { SubscriptionStatus } from "./subscription-status";
import { AttachmentForm } from "./attachment-form";
import { CourseMode } from "@prisma/client";

interface CourseRightSidebarProps {
  course: any; // Replace with proper Course type
  isAdmin: boolean;
  teacherProfiles: any[]; // Replace with proper TeacherProfile type
  coTeachers: any[]; // Replace with proper TeacherProfile type
}

export const CourseRightSidebar = ({
  course,
  isAdmin,
  teacherProfiles,
  coTeachers,
}: CourseRightSidebarProps) => {
  return (
    <div className="space-y-6">
      {isAdmin && (
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleUserRound} />
            <h2 className="text-xl">Author</h2>
          </div>
          <AuthorForm
            initialData={course}
            courseId={course.id}
            options={teacherProfiles?.map((teacher) => ({
              label: teacher.name,
              value: teacher.teacherProfile!.id,
              email: teacher.email,
            }))}
          />
        </div>
      )}

      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={ListChecks} />
          <h2 className="text-xl">Co-Authors</h2>
        </div>
        <CoAuthorForm initialData={course} courseId={course.id} />
      </div>

      {/* Course Mode Form */}
      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={CircleDollarSign} />
          <h2 className="text-xl">Course Mode</h2>
        </div>
        <CourseModeForm initialData={course} courseId={course.id} />
      </div>

      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={ListChecks} />
          <h2 className="text-xl">Course lessons</h2>
        </div>
        <LessonsForm initialData={course} courseId={course.id} admin={true} />
      </div>

      {/* Course Type Form */}
      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={CircleDollarSign} />
          <h2 className="text-xl">Course Type</h2>
        </div>
        <CourseTypeForm initialData={course} courseId={course.id} />
      </div>

      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={CircleDollarSign} />
          <h2 className="text-xl">Sell your course</h2>
        </div>
        <MultiplePriceForm initialData={course} courseId={course.id} />
      </div>

      {course?.courseMode === CourseMode.RECORDED &&
        !course?.prices[0]?.isFree && (
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Subscription</h2>
            </div>
            <SubscriptionStatus initialData={course} courseId={course.id} />
          </div>
        )}

      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={File} />
          <h2 className="text-xl">Resources & Attachments</h2>
        </div>
        <AttachmentForm initialData={course} courseId={course.id} />
      </div>
    </div>
  );
};
