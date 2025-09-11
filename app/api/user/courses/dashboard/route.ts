// api/user/courses/dashboard/route.ts
export const dynamic = "force-dynamic"; // Force dynamic behavior
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

// Optimized helper to calculate progress and next lesson for multiple courses
const calculateProgressAndNextLesson = async (
  courses: any[],
  userId: string
) => {
  if (!courses.length) return [];

  const courseIds = courses.map((course) => course.id);

  // Get all progress data for all courses in one query - only completed lessons
  const completedProgressData = await db.progress.findMany({
    where: {
      lesson: {
        courseId: { in: courseIds },
        isPublished: true,
      },
      studentProfile: {
        userId,
      },
      isCompleted: true, // Only get completed lessons
    },
    select: {
      lessonId: true,
      lesson: {
        select: {
          courseId: true,
          position: true,
        },
      },
    },
  });

  // Get all lessons for these courses in one query
  const allLessons = await db.lesson.findMany({
    where: {
      courseId: { in: courseIds },
      isPublished: true,
    },
    select: {
      id: true,
      courseId: true,
      slug: true,
      position: true,
    },
    orderBy: {
      position: "asc",
    },
  });

  // Group data by courseId for efficient lookup
  const completedLessonsByCourse = completedProgressData.reduce(
    (acc, progress) => {
      const courseId = progress.lesson.courseId;
      if (!acc[courseId]) acc[courseId] = [];
      acc[courseId].push({
        lessonId: progress.lessonId,
        position: progress.lesson.position,
      });
      return acc;
    },
    {} as Record<string, { lessonId: string; position: number }[]>
  );

  const lessonsByCourse = allLessons.reduce((acc, lesson) => {
    if (!acc[lesson.courseId]) acc[lesson.courseId] = [];
    acc[lesson.courseId].push(lesson);
    return acc;
  }, {} as Record<string, any[]>);

  // Calculate progress and next lesson for each course
  return courses.map((course) => {
    const courseLessons = lessonsByCourse[course.id] || [];
    const completedLessons = completedLessonsByCourse[course.id] || [];

    // Calculate progress percentage based on completed lessons
    const totalLessons = courseLessons.length;
    const completedCount = completedLessons.length;
    const progress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Find next lesson slug
    let nextLessonSlug = null;
    if (courseLessons.length > 0) {
      const completedLessonIds = completedLessons.map((cl) => cl.lessonId);

      // Find first incomplete lesson by position
      const nextLesson = courseLessons.find(
        (lesson) => !completedLessonIds.includes(lesson.id)
      );

      // If all completed, get first lesson (for review)
      nextLessonSlug = nextLesson?.slug || courseLessons[0]?.slug || null;
    }

    return {
      ...course,
      progress,
      nextLessonSlug,
      totalLessons,
      completedLessons: completedCount,
    };
  });
};

export async function GET(req: NextRequest) {
  try {
    // Get user session
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Single query to get user with all related data
    const userData = await db.user.findUnique({
      where: { id: userId },
      select: {
        studentProfile: {
          select: {
            id: true,
            subscription: {
              select: {
                status: true,
                expiresAt: true,
                subscriptionPlan: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                  },
                },
              },
            },
            enrolledCourseIds: {
              where: {
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
                    courseMode: true,
                    courseLiveBatchStartedAt: true,
                    liveSchedules: {
                      select: {
                        dayOfWeek: true,
                        startTime: true,
                        endTime: true,
                      },
                    },
                    totalDuration: true,
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
                        position: true,
                      },
                      orderBy: {
                        position: "asc",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userData?.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const { studentProfile } = userData;
    const subscription = studentProfile.subscription;

    // Check if user has active subscription
    const isSubscriber =
      subscription?.status === "ACTIVE" &&
      new Date(subscription.expiresAt) > new Date();

    // Extract purchased courses
    const purchasedCourses = studentProfile.enrolledCourseIds
      .filter((item) => item.course !== null)
      .map((item) => item.course);

    // Get subscribed courses if user has active subscription
    let subscribedCourses: any[] = [];
    if (isSubscriber) {
      subscribedCourses = await db.course.findMany({
        where: {
          isUnderSubscription: true,
          isPublished: true,
          id: {
            notIn: purchasedCourses.map((course) => course.id), // Exclude already purchased
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          totalDuration: true,
          courseMode: true,
          courseType: true,
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
              position: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      });
    }

    // Calculate progress and next lesson for all courses in batches
    const allCourses = [...purchasedCourses, ...subscribedCourses];
    const coursesWithProgress = await calculateProgressAndNextLesson(
      allCourses,
      userId
    );

    // Separate courses by completion status
    const completedCourses: any[] = [];
    const coursesInProgress: any[] = [];
    const processedSubscribedCourses: any[] = [];

    coursesWithProgress.forEach((course) => {
      const isPurchased = purchasedCourses.some((pc) => pc.id === course.id);

      if (isPurchased) {
        if (course.progress === 100) {
          completedCourses.push(course);
        } else {
          coursesInProgress.push(course);
        }
      } else {
        processedSubscribedCourses.push(course);
      }
    });

    const purchasedCourseIds = purchasedCourses.map((course) => course.id);

    return NextResponse.json(
      {
        completedCourses,
        coursesInProgress,
        subscribedCourses: processedSubscribedCourses,
        purchasedCourseIds,
        isSubscriber,
        subscription: subscription
          ? {
              status: subscription.status,
              expiresAt: subscription.expiresAt,
              plan: subscription.subscriptionPlan,
            }
          : null,
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
