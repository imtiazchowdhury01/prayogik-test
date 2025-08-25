import { db } from "@/lib/db";

export async function checkCourseAccess(courseSlug: string, userId: string) {
  try {
    if (!courseSlug || !userId) {
      return { access: false, error: "Unauthorized" };
    }

    // 1. Validate student profile
    const studentProfile = await db.studentProfile.findUnique({
      where: {
        userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!studentProfile) {
      return { access: false, error: "Student profile not found" };
    }

    const existingSubscription =
      studentProfile?.subscription?.status === "ACTIVE";

    // 2. Is the course under subscription and the user has a subscription?
    //  return { access: true };
    const course = await db.course.findUnique({
      where: {
        slug: courseSlug,
      },
      select: {
        isUnderSubscription: true,
      },
    });

    // Check if access has expired
    const isAccExpired = isAccessExpired(
      studentProfile.subscription?.expiresAt!
    );

    // if (isAccExpired) {
    //   return { access: false, error: "Access expired" };
    // }

    if (
      existingSubscription &&
      course &&
      course.isUnderSubscription &&
      !isAccExpired
    ) {
      return { access: true };
    }

    //  3. Check if the user has purchased the course
    const coursePurchase = await db.enrolledStudents.findFirst({
      where: {
        studentProfileId: studentProfile.id, // Use studentProfileId instead of userId
        course: {
          slug: courseSlug,
        },
      },
      include: {
        course: true,
        studentProfile: {
          select: {
            subscription: {
              select: {
                expiresAt: true,
              },
            },
          },
        },
      },
    });

    if (!coursePurchase) {
      return { access: false, error: "No purchase found" };
    }

    return { access: true };
  } catch (error) {
    console.error("Error checking course access", error);
    return { access: false, error: "Internal Server Error" };
  }
}

const isAccessExpired = (expiresAt: Date | null) => {
  if (!expiresAt) return false;
  const currentDate = new Date();
  return currentDate.getTime() > expiresAt.getTime();
};
