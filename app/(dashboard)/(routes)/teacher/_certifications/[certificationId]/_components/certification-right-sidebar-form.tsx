import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSign,
  CircleUserRound,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { CourseSelection } from "@/components/courseSeclection/courses-selection";
import { EventFAQForm } from "@/app/(dashboard)/(routes)/admin/events/[eventId]/_components/event-faq-form";
import { CertificationLevelForm } from "./certification-level-form";
import { CertificationMultiplePriceForm } from "./certification-multiple-price-form";
import { CertificationCoTeacherForm } from "./certification-coTeacher-form";
import { CertificationCourseSelectionForm } from "./certification-course-selection-form";
import { AuthorForm } from "../../../courses/[courseId]/_components/author-form";

interface CourseRightSidebarProps {
  certification: any; // Replace with proper Course type
  isAdmin: boolean;
  teacherProfiles: any[]; // Replace with proper TeacherProfile type
  coTeachers: any[]; // Replace with proper TeacherProfile type
}

export const CertificationCourseRightSidebar = ({
  certification,
  isAdmin,
  teacherProfiles,
  coTeachers,
}: CourseRightSidebarProps) => {
  const api = `/api/certifications/${certification?.id}`;
  return (
    <div className="space-y-6">
      {isAdmin && (
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleUserRound} />
            <h2 className="text-xl">Author</h2>
          </div>
          <AuthorForm
            initialData={certification}
            courseId={certification.id}
            options={teacherProfiles?.map((teacher) => ({
              label: teacher.name,
              value: teacher.teacherProfile!.id,
              email: teacher.email,
            }))}
            api={api}
          />
        </div>
      )}

      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={ListChecks} />
          <h2 className="text-xl">Teachers</h2>
        </div>
        <CertificationCoTeacherForm
          initialCoTeachers={certification?.coTeacherIds}
          certificationId={certification.id}
          teachers={coTeachers}
          api={api}
        />
      </div>

      {/* Course Mode Form */}
      {/* <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={CircleDollarSign} />
          <h2 className="text-xl">Course Mode</h2>
        </div>
        <CourseModeForm initialData={certification} courseId={certification.id} />
      </div> */}

      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={ListChecks} />
          <h2 className="text-xl">Courses</h2>
        </div>
        <CertificationCourseSelectionForm
          certificateId={certification?.id}
          certification={certification}
          api={api}
          className="mt-5"
        />
      </div>

      {/* Course Type Form */}
      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={CircleDollarSign} />
          <h2 className="text-xl">Type</h2>
        </div>
        <CertificationLevelForm
          initialData={certification}
          certificationId={certification.id}
        />
      </div>

      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={CircleDollarSign} />
          <h2 className="text-xl">Price</h2>
        </div>
        <CertificationMultiplePriceForm
          initialData={certification}
          certificationId={certification?.id}
        />
      </div>

      {/* {certification?.courseMode === CourseMode.RECORDED &&
        !certification?.prices[0]?.isFree && (
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Subscription</h2>
            </div>
            <SubscriptionStatus initialData={certification} courseId={certification.id} />
          </div>
        )} */}

      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={HelpCircle} />
          <h2 className="text-xl">FAQs</h2>
        </div>
        <EventFAQForm
          initialData={certification}
          certificateId={certification?.id}
          api={api}
          successMessage="Event FAQs Updated Successfully "
        />
      </div>
    </div>
  );
};
