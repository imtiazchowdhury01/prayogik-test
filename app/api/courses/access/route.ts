// // @ts-nocheck

// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";
// import { getServerUserSession } from "@/lib/getServerUserSession";

// export async function POST(req: Request) {
//   try {
//     const { courseSlug, userId } = await req.json();

//     if (!courseSlug || !userId) {
//       return NextResponse.json(
//         { access: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Find the purchase of the course by the user
//     const coursePurchase = await db.purchase.findFirst({
//       where: {
//         userId,
//         course: {
//           slug: courseSlug,
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         course: true,
//       },
//     });

//     // If no purchase found, deny access
//     if (!coursePurchase) {
//       return NextResponse.json(
//         { access: false, error: "No purchase found" },
//         { status: 404 }
//       );
//     }

//     // Check if the purchase includes access expiration and verify
//     const isAccExpired = isAccessExpired(coursePurchase.expiresAt);
//     if (isAccExpired) {
//       return NextResponse.json(
//         { access: false, error: "Access expired" },
//         { status: 403 }
//       );
//     }

//     // If access is valid, return success
//     return NextResponse.json({ access: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error checking course access", error);
//     return NextResponse.json(
//       { access: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // isAccessExpired function
// const isAccessExpired = (expiresAt: Date | null) => {
//   if (!expiresAt) return false; // If there's no expiration, access is valid
//   const currentDate = new Date();
//   return currentDate.getTime() > expiresAt.getTime(); // Compare current time with expiration
// };


import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface CourseAccessRequest {
  courseSlug: string;
  userId: string;
}

const isSubscriptionExpired = (expiresAt: Date | null): boolean => {
  if (!expiresAt) return true;
  return new Date() > expiresAt;
};

const createErrorResponse = (
  error: string,
  status: number = 400
): NextResponse => {
  return NextResponse.json({ access: false, error, nextLessonSlug: null }, { status });
};

const createSuccessResponse = (nextLessonSlug: string | null = null): NextResponse => {
  return NextResponse.json({ access: true, nextLessonSlug });
};

export async function POST(req: NextRequest) {
  try {
    const body: CourseAccessRequest = await req.json();
    const { courseSlug, userId } = body;

    // Validate required fields
    if (!courseSlug || !userId) {
      return createErrorResponse("Missing courseSlug or userId", 400);
    }

    // Get student profile with subscription details
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      include: {
        subscription: {
          select: {
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!studentProfile) {
      return createErrorResponse("Student profile not found", 404);
    }

    // Get course details
    const course = await db.course.findUnique({
      where: { slug: courseSlug },
      select: {
        id: true,
        isUnderSubscription: true,
        _count: {
          select: {
            lessons: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    if (!course) {
      return createErrorResponse("Course not found", 404);
    }

    // Check individual course purchase
    const coursePurchase = await db.enrolledStudents.findFirst({
      where: {
        studentProfileId: studentProfile.id,
        courseId: course.id,
      },
    });

    let hasAccess = false;

    // Check subscription-based access
    if (course.isUnderSubscription && !coursePurchase) {
      const { subscription } = studentProfile;

      if (!subscription) {
        return createErrorResponse(
          "Subscription required for this course",
          403
        );
      }

      if (subscription.status !== "ACTIVE") {
        return createErrorResponse("Active subscription required", 403);
      }

      if (isSubscriptionExpired(subscription.expiresAt)) {
        return createErrorResponse("Subscription has expired", 403);
      }

      hasAccess = true;
    } else if (coursePurchase) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return createErrorResponse("Course not purchased", 403);
    }

    // Calculate next lesson slug for users with access
    let nextLessonSlug: string | null = null;
    const totalLessons = course._count.lessons;

    if (totalLessons > 0) {
      const completedLessonsCount = await db.progress.count({
        where: {
          isCompleted: true,
          lesson: {
            courseId: course.id,
            isPublished: true,
          },
          studentProfile: {
            userId,
          },
        },
      });

      if (completedLessonsCount < totalLessons) {
        // Find next incomplete lesson
        const completedLessonIds = await db.progress.findMany({
          where: {
            lesson: {
              courseId: course.id,
              isPublished: true,
            },
            studentProfile: {
              userId,
            },
            isCompleted: true,
          },
          select: {
            lessonId: true,
          },
        });

        const completedIds = completedLessonIds.map((item) => item.lessonId);

        const nextLesson = await db.lesson.findFirst({
          where: {
            courseId: course.id,
            isPublished: true,
            id: {
              notIn: completedIds,
            },
          },
          orderBy: {
            position: "asc",
          },
          select: {
            slug: true,
          },
        });

        if (nextLesson) {
          nextLessonSlug = nextLesson.slug;
        }
      } else {
        // All lessons completed, return first lesson
        const firstLesson = await db.lesson.findFirst({
          where: {
            courseId: course.id,
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
          select: {
            slug: true,
          },
        });

        if (firstLesson) {
          nextLessonSlug = firstLesson.slug;
        }
      }
    }

    return createSuccessResponse(nextLessonSlug);
  } catch (error) {
    console.error("Error checking course access:", error);
    return NextResponse.json(
      { access: false, error: "Internal server error", nextLessonSlug: null },
      { status: 500 }
    );
  }
}