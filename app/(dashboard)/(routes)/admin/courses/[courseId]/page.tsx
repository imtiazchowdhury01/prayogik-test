//@ts-nocheck
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
} from "lucide-react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { fetchCategories } from "@/services";
import { Urls } from "@/constants/urls";
import { cookies } from "next/headers";
import { TitleForm } from "../../../teacher/courses/[courseId]/_components/title-form";
import { ImageForm } from "../../../teacher/courses/[courseId]/_components/image-form";
import { SlugTitleForm } from "../../../teacher/courses/[courseId]/_components/slug-title-form";
import { DescriptionForm } from "../../../teacher/courses/[courseId]/_components/description-form";
import { LearningOutcomesForm } from "../../../teacher/courses/[courseId]/_components/learningOutcome-form";
import { CourseRequirementsForm } from "../../../teacher/courses/[courseId]/_components/coureseRequirements-form";
import { CategoryForm } from "../../../teacher/courses/[courseId]/_components/category-form";
import { LessonsForm } from "../../../teacher/courses/[courseId]/_components/lessons-form";
import { MultiplePriceForm } from "../../../teacher/courses/[courseId]/_components/multiple-price-form";
import { AttachmentForm } from "../../../teacher/courses/[courseId]/_components/attachment-form";
import { SubscriptionStatus } from "../../../teacher/courses/[courseId]/_components/subscription-status";
import { Actions } from "../../../teacher/courses/[courseId]/_components/actions";
import { CoAuthorForm } from "../../../teacher/courses/[courseId]/_components/co-author-form";
import { AuthorForm } from "./_components/author-form";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { CourseTypeForm } from "../../../teacher/courses/[courseId]/_components/course-type-form";
import { CourseModeForm } from "../../../teacher/courses/[courseId]/_components/course-mode-form";
import { LiveLinkForm } from "../../../teacher/courses/[courseId]/_components/live-course-details";
import { CourseMode } from "@prisma/client";

async function getCourseById(courseId: string) {
  try {
    const response = await fetch(Urls.admin.courses + `/${courseId}`, {
      cache: "no-store",
      headers: {
        Cookie: cookies().toString(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }

    const courseData = await response.json();

    return courseData;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { isAdmin, userId } = await getServerUserSession();

  // If no user is logged in, redirect to home page
  if (!isAdmin) {
    return redirect("/");
  }

  // Fetch the course data and ensure the user is the owner (teacher)
  const course = await getCourseById(params.courseId);
  if (!course) return notFound();

  // Fetch the available categories to populate the category form
  const categories = await fetchCategories();

  // Fetch teacher profiles
  const teacherProfiles = await db.user.findMany({
    where: {
      teacherProfile: {
        isNot: null,
      },
    },
    select: {
      name: true,
      email: true,
      emailVerified: true,
      teacherProfile: {
        select: {
          id: true,
          teacherStatus: true,
          teacherRank: true,
        },
      },
    },
  });

  const coTeachers = teacherProfiles?.filter(
    (teacher) => teacher.teacherProfile?.id !== course.teacherProfileId
  );

  // If the course is not found or doesn't belong to the user, redirect to dashboard
  if (!course) {
    return redirect("/dashboard");
  }

  // Define required fields for the course setup completion
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.prices.some((price: any) => price.regularAmount) ||
      course.prices[0]?.isFree,
    course.categoryId,
    // course.lessons.some((chapter: any) => chapter.isPublished),
  ];

  // Calculate course setup progress
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  const teacherProfileId = await useTeacherProfile(userId);
  const isCourseAuthor = course.teacherProfileId === teacherProfileId;
  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="mt-4">
        <Link
          href={`/admin/courses`}
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
            isAdmin={isAdmin}
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
                value: category?.id,
              }))}
            />
          </div>
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
              <CoAuthorForm
                initialData={course}
                courseId={course.id}
                options={
                  coTeachers?.map((coTeacher: any) => ({
                    label: `${coTeacher.name} - ${coTeacher.email}`,
                    value: coTeacher.teacherProfile!.id,
                  })) || []
                }
              />
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
              <LessonsForm
                initialData={course}
                courseId={course.id}
                admin={true}
              />
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
                  <SubscriptionStatus
                    initialData={course}
                    courseId={course.id}
                  />
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
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
