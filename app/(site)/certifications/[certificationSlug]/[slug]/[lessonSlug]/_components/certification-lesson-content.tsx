import { redirect } from "next/navigation";
import { canAccessCertification } from "@/services/user";
import CertificationWrapperLayout from "./certification-wrapper-layout";
import { fetchCoursesAndLessonsUnderCertification } from "../_actions/getCoursesAndLessons";

async function CertificationLessonContent({
  certificationSlug,
  slug,
  lessonSlug,
}: {
  slug: string;
  lessonSlug: string;
  certificationSlug: string;
}) {
  const {
    certification,
    course,
    currentLesson,
    lessons,
    nextLesson,
    studentProfileId,
    userId,
    progress,
    purchase,
  } = await fetchCoursesAndLessonsUnderCertification(
    slug,
    lessonSlug,
    certificationSlug
  );
  // console.log({ certification });

  // Handle redirects
  if (!userId || !certification) {
    redirect(`/certifications/${certification?.slug}`);
  }

  const accessResponse = await canAccessCertification(
    userId,
    certification?.id
  );
  // console.log("Certification access", accessResponse);

  if (!accessResponse?.access) {
    return redirect(`/courses/${slug}`);
  }

  return (
    <CertificationWrapperLayout
      certification={certification}
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

export default CertificationLessonContent;
