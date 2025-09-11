export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function GET(req: NextRequest) {
  try {
    // Get user session
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SINGLE MEGA QUERY - Get everything we need in one database call
    const [userData, allProgressData] = await Promise.all([
      // Query 1: Get user data with all courses (purchased + available for subscription)
      db.user.findUnique({
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
              // Get purchased courses with all needed data including lessons
              enrolledCourseIds: {
                where: {
                  course: { isPublished: true },
                },
                select: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                      description: true,
                      slug: true,
                      courseMode: true,
                      courseType: true,
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
                            select: { name: true },
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
                        select: { enrolledStudents: true },
                      },
                      // Include lessons in the same query
                      lessons: {
                        where: { isPublished: true },
                        select: {
                          id: true,
                          slug: true,
                          position: true,
                        },
                        orderBy: { position: "asc" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),

      // Query 2: Get ALL progress data for this user in one go
      db.progress.findMany({
        where: {
          studentProfile: { userId },
          isCompleted: true,
          lesson: { isPublished: true },
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
      }),
    ]);

    if (!userData?.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const { studentProfile } = userData;
    const subscription = studentProfile.subscription;

    // Check subscription status
    const now = new Date();
    const isSubscriber = Boolean(
      subscription?.status === "ACTIVE" &&
        subscription.expiresAt &&
        new Date(subscription.expiresAt) > now
    );

    // Extract purchased courses
    const purchasedCourses = studentProfile.enrolledCourseIds
      .map((item) => item.course)
      .filter(Boolean);

    const purchasedCourseIds = new Set(
      purchasedCourses.map((course) => course.id)
    );

    // Get subscribed courses ONLY if user is subscriber AND we need them
    let subscribedCourses: any[] = [];
    if (isSubscriber) {
      // Query 3 (CONDITIONAL): Only fetch if user is subscriber
      subscribedCourses = await db.course.findMany({
        where: {
          isUnderSubscription: true,
          isPublished: true,
          id: { notIn: Array.from(purchasedCourseIds) },
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
                select: { name: true },
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
            select: { enrolledStudents: true },
          },
          // Include lessons for subscribed courses too
          lessons: {
            where: { isPublished: true },
            select: {
              id: true,
              slug: true,
              position: true,
            },
            orderBy: { position: "asc" },
          },
        },
      });
    }

    // Create progress lookup map for O(1) access
    const completedLessonsMap = new Map<string, Set<string>>();
    allProgressData.forEach((progress) => {
      const courseId = progress.lesson.courseId;
      if (!completedLessonsMap.has(courseId)) {
        completedLessonsMap.set(courseId, new Set());
      }
      completedLessonsMap.get(courseId)!.add(progress.lessonId);
    });

    // Process all courses (purchased + subscribed) in one pass
    const allCourses = [...purchasedCourses, ...subscribedCourses];

    const completedCourses: any[] = [];
    const coursesInProgress: any[] = [];
    const processedSubscribedCourses: any[] = [];

    // Single loop to process all courses
    allCourses.forEach((course) => {
      const lessons = course.lessons || [];
      const completedLessons = completedLessonsMap.get(course.id) || new Set();

      // Calculate progress
      const totalLessons = lessons.length;
      const completedCount = completedLessons.size;
      const progress =
        totalLessons > 0
          ? Math.round((completedCount / totalLessons) * 100)
          : 0;

      // Find next lesson
      const nextLesson = lessons.find(
        (lesson: any) => !completedLessons.has(lesson.id)
      );
      const nextLessonSlug = nextLesson?.slug || lessons[0]?.slug || null;

      // Create enhanced course object
      const enhancedCourse = {
        ...course,
        progress,
        nextLessonSlug,
        totalLessons,
        completedLessons: completedCount,
      };

      // Categorize course
      const isPurchased = purchasedCourseIds.has(course.id);

      if (isPurchased) {
        if (progress === 100) {
          completedCourses.push(enhancedCourse);
        } else {
          coursesInProgress.push(enhancedCourse);
        }
      } else {
        processedSubscribedCourses.push(enhancedCourse);
      }
    });

    // Prepare response
    const subscriptionResponse = subscription
      ? {
          status: subscription.status,
          expiresAt: subscription.expiresAt,
          plan: subscription.subscriptionPlan,
        }
      : null;

    return NextResponse.json({
      completedCourses,
      coursesInProgress,
      subscribedCourses: processedSubscribedCourses,
      purchasedCourseIds: Array.from(purchasedCourseIds),
      isSubscriber,
      subscription: subscriptionResponse,
    });
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
