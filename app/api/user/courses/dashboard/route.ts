// api/user/courses/dashboard/route.ts
export const dynamic = "force-dynamic"; // Force dynamic behavior
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { getServerUserSession } from "@/lib/getServerUserSession";

// Helper to add nextLessonSlug
const addNextLessonSlug = async (course: any, userId: string) => {
  let nextLessonSlug = null;

  if (userId && course.lessons && course.lessons.length > 0) {
    // Get completed lesson IDs
    const completedLessonIds = await db.progress.findMany({
      where: {
        lesson: {
          courseId: course.id,
          isPublished: true,
        },
        studentProfile: {
          userId,
        },
      },
      select: {
        lessonId: true,
      },
    });

    const completedIds = completedLessonIds.map((item) => item.lessonId);

    // Find the first incomplete lesson
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

    nextLessonSlug = nextLesson?.slug;

    // If no incomplete lesson found (all completed), get the first lesson
    if (!nextLessonSlug) {
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

      nextLessonSlug = firstLesson?.slug || null;
    }
  }

  return {
    ...course,
    nextLessonSlug,
  };
};

export async function GET(req: NextRequest) {
  try {
    // Get user session (adapt if you use a different auth system)
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentProfileId = await useStudentProfile(userId);

    // Check if user is subscribed
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            subscription: {
              include: {
                subscriptionPlan: true,
              },
            },
          },
        },
      },
    });

    const subscription = user?.studentProfile?.subscription;
    const isSubscriber =
      subscription?.status === "ACTIVE" &&
      new Date(subscription.expiresAt) > new Date();

    // Get purchased courses
    const purchases = await db.enrolledStudents.findMany({
      where: {
        studentProfileId,
        course: {
          isPublished: true,
        },
      },
      select: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            totalDuration: true,
            purchases: true,
            teacherProfile: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            imageUrl: true,
            isPublished: true,
            prices: {
              select: {
                regularAmount: true,
                isFree: true,
              },
            },
            isUnderSubscription: true,
            _count: {
              select: {
                enrolledStudents: true,
              },
            },
            lessons: {
              where: {
                isPublished: true,
              },
              select: {
                id: true,
                slug: true,
                title: true,
                isPublished: true,
                isFree: true,
                videoUrl: true,
                Progress: true,
                position: true,
              },
            },
          },
        },
      },
    });

    // Get subscribed courses (only if user is subscribed)
    let subscribedCoursesRes: any[] = [];
    if (isSubscriber) {
      subscribedCoursesRes = await db.course.findMany({
        where: {
          isUnderSubscription: true,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          totalDuration: true,
          purchases: true,
          teacherProfile: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          imageUrl: true,
          isPublished: true,
          prices: {
            select: {
              regularAmount: true,
              isFree: true,
            },
          },
          isUnderSubscription: true,
          _count: {
            select: {
              enrolledStudents: true,
            },
          },
          lessons: {
            where: {
              isPublished: true,
            },
            select: {
              id: true,
              slug: true,
              title: true,
              isPublished: true,
              isFree: true,
              videoUrl: true,
              Progress: true,
              position: true,
            },
          },
        },
      });
    }

    const purchasedCourseIds = purchases
      .filter((item) => item.course !== null)
      .map((item) => item.course.id);

    const coursesArray = purchases
      .filter((item) => item.course !== null)
      .map((item) => item.course);

    let completedCourses: any[] = [];
    let coursesInProgress: any[] = [];
    let subscribedCourses: any[] = [];

    // Calculate progress for each purchased course
    const progressPromises = coursesArray.map(async (course) => {
      const progress = await getProgress(userId, course.id);

      const courseWithProgress = {
        ...course,
        progress,
      };

      if (progress === 100) {
        completedCourses.push(courseWithProgress);
      } else {
        coursesInProgress.push(courseWithProgress);
      }
    });

    await Promise.all(progressPromises);

    // Calculate progress for each subscribed course (only if user has active subscription)
    if (isSubscriber && subscribedCoursesRes.length > 0) {
      const subscribedProgressPromises = subscribedCoursesRes.map(
        async (course) => {
          const progress = await getProgress(userId, course.id);

          const courseWithProgress = {
            ...course,
            progress,
          };

          subscribedCourses.push(courseWithProgress);
        }
      );

      await Promise.all(subscribedProgressPromises);
    }

    // Add nextLessonSlug to each course
    const processedCoursesInProgress = await Promise.all(
      coursesInProgress.map((course) => addNextLessonSlug(course, userId))
    );

    const processedCompletedCourses = await Promise.all(
      completedCourses.map((course) => addNextLessonSlug(course, userId))
    );

    // Process subscribed courses only if user has active subscription
    const processedSubscribedCourses =
      isSubscriber && subscribedCourses.length > 0
        ? await Promise.all(
            subscribedCourses.map((course) => addNextLessonSlug(course, userId))
          )
        : [];

    return NextResponse.json(
      {
        completedCourses: processedCompletedCourses,
        coursesInProgress: processedCoursesInProgress,
        subscribedCourses: processedSubscribedCourses,
        purchasedCourseIds,
        isSubscriber,
        subscription,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
