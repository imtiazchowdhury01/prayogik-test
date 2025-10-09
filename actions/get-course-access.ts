// actions/get-course-access.ts
"use server";

import { db } from "@/lib/db";

type CourseAccessResponse = {
  access: boolean;
  error?: string;
};

export async function checkCourseAccess(
  courseSlug: string,
  userId: string
): Promise<CourseAccessResponse> {
  try {
    if (!courseSlug || !userId) {
      return { access: false, error: "Unauthorized" };
    }

    // 1. Validate student profile and get subscription
    const studentProfile = await db.studentProfile.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        subscription: {
          select: {
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!studentProfile) {
      return { access: false, error: "Student profile not found" };
    }

    // 2. Get the course details
    const course = await db.course.findUnique({
      where: {
        slug: courseSlug,
        isPublished: true,
      },
      select: {
        id: true,
        isUnderSubscription: true,
      },
    });

    if (!course) {
      return { access: false, error: "Course not found" };
    }

    // 3. Check subscription access if course is under subscription
    const hasActiveSubscription =
      studentProfile.subscription?.status === "ACTIVE";
    const subscriptionExpired = isAccessExpired(
      studentProfile.subscription?.expiresAt ?? null
    );

    if (
      course.isUnderSubscription &&
      hasActiveSubscription &&
      !subscriptionExpired
    ) {
      return { access: true };
    }

    // 4. Check if the user has enrolled in the course (purchased)
    const enrollment = await db.enrolledStudents.findFirst({
      where: {
        studentProfileId: studentProfile.id,
        courseId: course.id,
      },
      select: {
        id: true,
      },
    });

    if (!enrollment) {
      return { access: false, error: "No purchase found" };
    }

    return { access: true };
  } catch (error) {
    console.error("[CHECK_COURSE_ACCESS]", error);
    return { access: false, error: "Internal Server Error" };
  }
}

const isAccessExpired = (expiresAt: Date | null): boolean => {
  if (!expiresAt) return false;
  const currentDate = new Date();
  return currentDate.getTime() > expiresAt.getTime();
};
