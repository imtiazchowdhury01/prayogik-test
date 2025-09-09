import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Urls } from "@/constants/urls";
import { cookies } from "next/headers";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { CourseHeader } from "./course-header";
import { CourseLeftSidebar } from "./course-left-sidebar";
import { CourseRightSidebar } from "./course-right-sdebar";
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

export const CourseForm = async ({
  courseId,
  userId,
  isAdmin,
}: CourseDataLoaderProps) => {
  // Fetch data in parallel
  const [course, teacherProfiles] = await Promise.all([
    getCourseById(courseId),
    getTeacherProfiles(),
  ]);

  if (!course) return notFound();

  const coTeachers = teacherProfiles?.filter(
    (teacher) => teacher.teacherProfile?.id !== course.teacherProfileId
  );

  // Define required fields for the course setup completion
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.prices.some((price: any) => price.regularAmount) ||
      course.prices[0]?.isFree,
    course.categoryId,
  ];

  // Calculate course setup progress
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  const teacherProfileId = await useTeacherProfile(userId);
  const isCourseAuthor = course.teacherProfileId === teacherProfileId;

  return (
    <div>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}

      <br />
      <CourseHeader
        courseId={courseId}
        completionText={completionText}
        isComplete={isComplete}
        isPublished={course.isPublished}
        isAdmin={isAdmin}
        isCourseAuthor={isCourseAuthor}
      />

      <div className="grid grid-cols-1 gap-6 mt-16 lg:grid-cols-2">
        <CourseLeftSidebar course={course} />
        <CourseRightSidebar
          course={course}
          isAdmin={isAdmin}
          teacherProfiles={teacherProfiles}
          coTeachers={coTeachers}
        />
      </div>
    </div>
  );
};
