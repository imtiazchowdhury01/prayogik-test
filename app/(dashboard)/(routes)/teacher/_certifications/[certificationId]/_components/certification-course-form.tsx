// @ts-nocheck
import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { clientApi } from "@/lib/utils/openai/client";
import { CertificationCourseLeftSidebar } from "./certification-course-left-sidebar";
import { CertificationCourseRightSidebar } from "./certification-right-sidebar-form";
import { CertificationHeader } from "./certification-header";

async function getCourseById(certificationId: string) {
  try {
    const { body } = await clientApi.getCertificationById({
      params: {
        certificationId,
      },
      extraHeaders: {
        Cookie: cookies().toString(),
      },
    });

    if (body.error) {
      const errorMessage = body?.message || "Failed to fetch course details";
      throw new Error(errorMessage);
    }

    const courseData = await body;
    return courseData;
  } catch (error) {
    console.error("Error fetching certification:", error);
    return null;
  }
}

async function getTeacherProfiles() {
  return await db.user.findMany({
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
}

interface CourseDataLoaderProps {
  courseId: string;
  userId: string;
  isAdmin: boolean;
}

export const CertificationCourseForm = async ({
  courseId,
  userId,
  isAdmin,
}: CourseDataLoaderProps) => {
  // Fetch data in parallel
  const [certification, teacherProfiles] = await Promise.all([
    getCourseById(courseId),
    getTeacherProfiles(),
  ]);

  if (!certification) return notFound();

  const coTeachers = teacherProfiles?.filter(
    (teacher) => teacher.teacherProfile?.id !== certification?.teacherProfileId
  );

  // Define required fields for the certification setup completion
  const requiredFields = [
    certification.title,
    certification.description,
    certification.imageUrl,
    certification?.prices?.some((price: any) => price.regularAmount) ||
      certification?.prices[0]?.isFree,
    certification?.slug,
    certification?.courseIds?.length > 0,
  ];

  // Calculate certification setup progress
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  const teacherProfileId = await useTeacherProfile(userId);
  const isCertificationAuthor =
    certification.teacherProfileId === teacherProfileId;

  return (
    <div>
      {!certification.isPublished && (
        <Banner label="This certification is unpublished. It will not be visible to the students." />
      )}

      <br />
      <CertificationHeader
        certificationId={courseId}
        completionText={completionText}
        isComplete={isComplete}
        isPublished={certification.isPublished}
        isAdmin={isAdmin}
        isCertificationAuthor={isCertificationAuthor}
        certificationSlug={certification?.slug}
      />

      <div className="grid grid-cols-1 gap-6 mt-16 lg:grid-cols-2">
        <CertificationCourseLeftSidebar certification={certification} />
        <CertificationCourseRightSidebar
          certification={certification}
          isAdmin={isAdmin}
          teacherProfiles={teacherProfiles}
          coTeachers={coTeachers}
        />
      </div>
    </div>
  );
};
