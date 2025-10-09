import { redirect } from "next/navigation";
import { fetchCourseAndLesson } from "../_actions/fetchCourseAndLesson";
import LessonWrapperLayout from "./lesson-wrapper-layout";
import { canAccessCourse } from "@/services/user";

async function LessonContent({
  slug,
  lessonSlug,
}: {
  slug: string;
  lessonSlug: string;
}) {
  const {
    course,
    currentLesson,
    lessons,
    nextLesson,
    studentProfileId,
    userId,
    progress,
    purchase,
  } = await fetchCourseAndLesson(slug, lessonSlug);
  // Handle redirects
  if (!userId || !course) {
    redirect(`/courses/${slug}`);
  }

  const accessResponse = await canAccessCourse(userId, course?.id);
  console.log("Lesson access", accessResponse);

  if (!accessResponse?.access) {
    return redirect(`/courses/${slug}`);
  }

  return (
    <LessonWrapperLayout
      course={course}
      lessons={lessons}
      initialLesson={currentLesson}
      nextLesson={nextLesson}
      studentProfileId={studentProfileId}
      currentLessonSlug={lessonSlug}
      courseSlug={slug}
      userId={userId}
      progress={progress}
      purchase={purchase}
    />
  );
}

export default LessonContent;
