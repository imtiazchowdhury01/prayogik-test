// @ts-nocheck

import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import {
  ArrowLeft,
  CircleDollarSign,
  CircleUserRound,
  File,
  LayoutDashboard,
  ListChecks,
  Users2,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import { AttachmentForm } from "./_components/attachment-form";
import { CategoryForm } from "./_components/category-form";
import { ChaptersForm } from "./_components/chapters-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { TitleForm } from "./_components/title-form";
import { MultiplePriceForm } from "./_components/multiple-price-form";
import { LessonsForm } from "./_components/lessons-form";
import { LearningOutcomesForm } from "./_components/learningOutcome-form";
import { CourseRequirementsForm } from "./_components/coureseRequirements-form";
import { SlugTitleForm } from "./_components/slug-title-form";
import Link from "next/link";
import { FreeForMemberStatus } from "./_components/FreeForMemberStatus";
import { MembershipStatus } from "./_components/MembershipStatus";
import { SubscriptionStatus } from "./_components/subscription-status";
import { CoAuthorForm } from "./_components/co-author-form";
import { cn } from "@/lib/utils";
import { clientApi } from "@/lib/utils/openai/client";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { cookies } from "next/headers";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = await getServerUserSession();
  // If no user is logged in, redirect to home page
  if (!userId) {
    return redirect("/");
  }

  const teacherProfileId = await useTeacherProfile(userId);

  // Fetch the course data and ensure the user is the owner (teacher)

  const { body: course } = await clientApi.getTeacherCourseByIdQuery({
    params: {
      courseId: params.courseId,
    },
    extraHeaders: {
      cookie: cookies().toString(),
    },
  });
  // If course is not match with the teacherId, redirect to dashboard
  const isMainTeacher = course?.teacherProfileId === teacherProfileId;

  const isCoTeacher = course?.coTeachers?.some(
    (coTeacher) => coTeacher.id === teacherProfileId
  );

  if (!course || (!isMainTeacher && !isCoTeacher)) {
    return redirect("/teacher/courses");
  }

  // Fetch the available categories to populate the category form
  const { body: categories } = await clientApi.getCategories({
    extraHeaders: {
      cookie: cookies().toString(),
    },
  });

  const { body: teacherProfiles } = await clientApi.getTeacherProfiles({
    extraHeaders: {
      cookie: cookies().toString(),
    },
  });

  const coTeachers = teacherProfiles?.filter(
    (teacher) => teacher.teacherProfile?.id !== course.teacherProfileId
  );

  // If the course is not found or doesn't belong to the user, redirect to dashboard
  if (!course) {
    return redirect("/teacher/courses");
  }

  // Define required fields for the course setup completion
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.prices.some((price) => price.regularAmount) ||
      course.prices[0]?.isFree,
    course.categoryId,
    course.lessons.some((chapter) => chapter.isPublished),
  ];

  // Calculate course setup progress
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  const isCourseAuthor = course.teacherProfileId === teacherProfileId;

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <Link
          href={`/teacher/courses`}
          className="w-fit flex items-center mb-6 text-sm transition hover:opacity-75"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to courses
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all required fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
            isCoTeacher={isCoTeacher}
            isCourseAuthor={isCourseAuthor}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 mt-16 lg:grid-cols-2">
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
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category?.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            {/* Co teachers Form */}
            {isCoTeacher && (
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={CircleUserRound} />
                  <h2 className="text-xl">Author</h2>
                </div>
                <div className="mt-6 border bg-slate-100 rounded-md p-4">
                  <span className="font-medium">Course author</span>
                  <p className={cn("text-sm mt-2 text-slate-500 italic")}>
                    {course.teacherProfileId
                      ? course?.teacherProfile?.user?.name
                      : "No author"}
                  </p>
                </div>
              </div>
            )}
            {!isCoTeacher && (
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Co-Authors</h2>
                </div>
                <CoAuthorForm
                  initialData={course}
                  courseId={course.id}
                  options={coTeachers?.map((coTeacher) => ({
                    label: `${coTeacher.name} - ${coTeacher.email}`,
                    value: coTeacher.teacherProfile.id,
                  }))}
                />
              </div>
            )}

            <div>
              {/* Lessons Form */}
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course lessons</h2>
              </div>
              <LessonsForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <MultiplePriceForm initialData={course} courseId={course.id} />
            </div>
            {/* {!course?.prices[0]?.isFree && (
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={CircleDollarSign} />
                  <h2 className="text-xl">Subscription</h2>
                </div>
                <SubscriptionStatus initialData={course} courseId={course.id} />
              </div>
            )} */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
