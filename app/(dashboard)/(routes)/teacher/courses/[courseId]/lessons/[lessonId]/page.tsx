// @ts-nocheck

import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LessonAccessForm } from "./_components/lesson-access-form";
import { LessonDescriptionForm } from "./_components/lesson-description-form";
import { LessonTitleForm } from "./_components/lesson-title-form";
import { LessonActions } from "./_components/lesson-actions";
import { LessonSlugTitleForm } from "./_components/lesson-slug-title-form";
import VideoInputSection from "./_components/VideoInputSection"; // Import the new component
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";

const LessonIdPage = async ({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) => {
  // Await the session retrieval
  const { userId } = await getServerUserSession();

  // Redirect to home if the user is not authenticated
  if (!userId) {
    return redirect("/");
  }

  // Fetch the chapter from the database
  const { body: lesson } = await clientApi.getTeacherCourseLesson({
    params: {
      courseId: params.courseId,
      lessonId: params.lessonId,
    },
    extraHeaders: {
      cookie: cookies().toString(), // Pass cookies for session validation
    },
  });

  // Redirect to dashboard if the chapter does not exist
  if (!lesson) {
    return redirect("/dashboard");
  }

  // Determine required fields for chapter completion
  const requiredFields = [lesson.title, lesson.videoUrl || lesson.textContent];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {/* Banner for unpublished chapter */}
      {!lesson.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course."
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="w-fit flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>

            <div className="flex items-center flex-wrap gap-6 sm:gap-0 justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Lesson Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all required fields {completionText}
                </span>
              </div>

              <LessonActions
                disabled={!isComplete}
                courseId={params.courseId}
                lessonId={params.lessonId}
                isPublished={lesson.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <div>
                  <h2 className="text-xl">Customize your lesson</h2>
                  <p className="text-xs text-gray-500">
                    Provide a <b>Lesson title</b>, <b>Slug</b> and either{" "}
                    <b>Content</b> or a <b>Video</b> to publish.
                  </p>
                </div>
              </div>

              <LessonTitleForm
                initialData={lesson}
                courseId={params.courseId}
                lessonId={params.lessonId}
              />
              <LessonSlugTitleForm
                initialData={lesson}
                courseId={params.courseId}
                lessonId={params.lessonId}
              />
              <LessonDescriptionForm
                initialData={lesson}
                courseId={params.courseId}
                lessonId={params.lessonId}
              />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <LessonAccessForm
                initialData={lesson}
                courseId={params.courseId}
                lessonId={params.lessonId}
              />
            </div>
          </div>

          {/* videocipher  */}
          <div>
            <VideoInputSection
              lesson={lesson}
              courseId={params.courseId}
              lessonId={params.lessonId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonIdPage;
