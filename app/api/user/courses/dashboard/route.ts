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

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab");
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const metadataOnly = searchParams.get("metadataOnly") === "true";
    const offset = page * limit;

    // If only metadata is requested, return subscription and purchased course IDs
    if (metadataOnly) {
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
                  isTrial: true,
                  trialSelectedCourseIds: true,
                  subscriptionPlan: {
                    select: {
                      id: true,
                      name: true,
                      type: true,
                      isTrial: true,
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

      const now = new Date();
      const isSubscriber = Boolean(
        subscription?.status === "ACTIVE" &&
          subscription.expiresAt &&
          new Date(subscription.expiresAt) > now
      );

      // Get purchased course IDs using EnrolledStudents
      const enrolledCourses = await db.enrolledStudents.findMany({
        where: { studentProfileId: studentProfile.id },
        select: { courseId: true },
      });

      const purchasedCourseIds = enrolledCourses.map((item) => item.courseId);

      const subscriptionResponse = subscription
        ? {
            status: subscription.status,
            expiresAt: subscription.expiresAt,
            isTrial: subscription.isTrial,
            trialSelectedCourseIds: subscription.trialSelectedCourseIds,
            plan: subscription.subscriptionPlan,
          }
        : null;

      return NextResponse.json({
        purchasedCourseIds,
        isSubscriber,
        subscription: subscriptionResponse,
      });
    }

    // Handle specific tab requests with pagination
    switch (tab) {
      case "purchased":
        return handlePurchasedCourses(userId, offset, limit);

      case "subscription":
        return handleSubscriptionCourses(userId, offset, limit);

      case "certificate":
        return handleCertificateCourses(userId, offset, limit);

      case "event":
        return handleRegisteredEvents(userId, offset, limit);

      default:
        return NextResponse.json(
          { error: "Invalid tab parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handlePurchasedCourses(
  userId: string,
  offset: number,
  limit: number
) {
  // console.log(`[API] Handling purchased courses - offset: ${offset}, limit: ${limit}`);

  // First get student profile
  const studentProfile = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!studentProfile) {
    return NextResponse.json(
      { error: "Student profile not found" },
      { status: 404 }
    );
  }

  // Get purchased courses with progress calculation
  const [purchasedCoursesData, totalCount, allProgressData] = await Promise.all(
    [
      // Query 1: Get paginated purchased courses using EnrolledStudents
      db.enrolledStudents.findMany({
        where: {
          studentProfileId: studentProfile.id,
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
        skip: offset,
        take: limit,
      }),

      // Query 2: Get total count of purchased courses
      db.enrolledStudents.count({
        where: {
          studentProfileId: studentProfile.id,
          course: { isPublished: true },
        },
      }),

      // Query 3: Get all progress data for this user
      db.progress.findMany({
        where: {
          studentProfileId: studentProfile.id,
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
    ]
  );

  const courses = purchasedCoursesData.map((item) => item.course);
  const total = totalCount;

  // Create progress lookup map
  const completedLessonsMap = new Map<string, Set<string>>();
  allProgressData.forEach((progress) => {
    const courseId = progress.lesson.courseId;
    if (!completedLessonsMap.has(courseId)) {
      completedLessonsMap.set(courseId, new Set());
    }
    completedLessonsMap.get(courseId)!.add(progress.lessonId);
  });

  // Process courses with progress
  const processedCourses = courses.map((course) => {
    const lessons = course?.lessons || [];
    const completedLessons =
      completedLessonsMap.get(course?.id as string) || new Set();

    const totalLessons = lessons.length;
    const completedCount = completedLessons.size;
    const progress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const nextLesson = lessons.find(
      (lesson: any) => !completedLessons.has(lesson.id)
    );
    const nextLessonSlug = nextLesson?.slug || lessons[0]?.slug || null;

    return {
      ...course,
      progress,
      nextLessonSlug,
      totalLessons,
      completedLessons: completedCount,
    };
  });

  const hasMore = offset + limit < total;

  return NextResponse.json({
    courses: processedCourses,
    totalCount: total,
    hasMore: hasMore,
    nextCursor: hasMore ? offset + limit : undefined,
  });
}

async function handleSubscriptionCourses(
  userId: string,
  offset: number,
  limit: number
) {
  // console.log(`[API] Handling subscription courses - offset: ${offset}, limit: ${limit}`);

  // First get student profile and subscription status
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
              isTrial: true,
              trialSelectedCourseIds: true,
              trialSelectedCourses: true,
              subscriptionPlan: {
                select: {
                  isTrial: true,
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
  const subscription: any = studentProfile.subscription;
  const now = new Date();
  const isSubscriber = Boolean(
    subscription?.status === "ACTIVE" &&
      subscription.expiresAt &&
      new Date(subscription.expiresAt) > now
  );

  if (!isSubscriber) {
    return NextResponse.json({
      courses: [],
      totalCount: 0,
      hasMore: false,
      isSubscriber: false,
      isTrial: false,
    });
  }

  // Get enrolled course IDs to exclude them
  const enrolledCourseIds = await db.enrolledStudents.findMany({
    where: { studentProfileId: studentProfile.id },
    select: { courseId: true },
  });

  // const purchasedCourseIds = enrolledCourseIds.map((item) => item.courseId);

  // Determine course filtering based on subscription type
  const isTrial = subscription?.subscriptionPlan?.isTrial;
  const trialSelectedCourseIds = subscription.trialSelectedCourseIds || [];

  // Build course where condition based on subscription type
  let courseWhereCondition: any = {
    isUnderSubscription: true,
    isPublished: true,
    // id: { notIn: purchasedCourseIds },
  };

  // If it's a trial subscription, only show selected courses
  // if (isTrial && trialSelectedCourseIds.length > 0) {
  if (trialSelectedCourseIds.length > 0) {
    courseWhereCondition.id = {
      in: trialSelectedCourseIds,
      // notIn: purchasedCourseIds,
    };
  }

  // Get paginated subscription courses
  const [courses, totalCount, allProgressData] = await Promise.all([
    db.course.findMany({
      where: courseWhereCondition,
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
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),

    // Get total count
    db.course.count({
      where: courseWhereCondition,
    }),

    // Get progress data
    db.progress.findMany({
      where: {
        studentProfileId: studentProfile.id,
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

  // console.log(`[API] Found ${courses.length} subscription courses for this page, ${totalCount} total (Trial: ${isTrial})`);

  // Create progress lookup map
  const completedLessonsMap = new Map<string, Set<string>>();
  allProgressData.forEach((progress) => {
    const courseId = progress.lesson.courseId;
    if (!completedLessonsMap.has(courseId)) {
      completedLessonsMap.set(courseId, new Set());
    }
    completedLessonsMap.get(courseId)!.add(progress.lessonId);
  });

  // Process courses with progress
  const processedCourses = courses.map((course) => {
    const lessons = course.lessons || [];
    const completedLessons = completedLessonsMap.get(course.id) || new Set();

    const totalLessons = lessons.length;
    const completedCount = completedLessons.size;
    const progress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const nextLesson = lessons.find(
      (lesson: any) => !completedLessons.has(lesson.id)
    );
    const nextLessonSlug = nextLesson?.slug || lessons[0]?.slug || null;

    return {
      ...course,
      progress,
      nextLessonSlug,
      totalLessons,
      completedLessons: completedCount,
    };
  });

  const hasMore = offset + limit < totalCount;

  // console.log(`[API] Returning subscription courses - hasMore: ${hasMore}, nextCursor: ${hasMore ? offset + limit : undefined}`);

  return NextResponse.json({
    courses: processedCourses,
    totalCount,
    hasMore: hasMore,
    nextCursor: hasMore ? offset + limit : undefined,
    isSubscriber: true,
    isTrial,
    trialSelectedCourseIds: isTrial ? trialSelectedCourseIds : undefined,
  });
}

// async function handlePurchasedCoursesTest(
//   userId: string,
//   offset: number,
//   limit: number
// ) {
//   // console.log(`[API] Handling certificate courses - offset: ${offset}, limit: ${limit}`);

//   // TODO: Implement certificate courses logic

//   await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

//   return NextResponse.json({
//     courses: [],
//     totalCount: 0,
//     hasMore: false,
//     nextCursor: undefined,
//   });
// }

async function handleCertificateCourses(
  userId: string,
  offset: number,
  limit: number
) {
  // console.log(`[API] Handling purchased courses - offset: ${offset}, limit: ${limit}`);

  // First get student profile
  const studentProfile = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!studentProfile) {
    return NextResponse.json(
      { error: "Student profile not found" },
      { status: 404 }
    );
  }

  // Get purchased certifications with progress calculation
  const [purchasedCertificationCoursesData, totalCount, allProgressData] =
    await Promise.all([
      // Query 1: Get paginated purchased certifications using EnrolledStudents
      db.enrolledStudents.findMany({
        where: {
          studentProfileId: studentProfile.id,
          certification: { isPublished: true },
        },
        select: {
          certification: {
            select: {
              id: true,
              title: true,
              description: true,
              slug: true,
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
              _count: {
                select: { enrolledStudents: true },
              },
              courses: {
                where: { isPublished: true },
                select: {
                  id: true,
                  slug: true,
                },
              },
            },
          },
        },
        skip: offset,
        take: limit,
      }),

      // Query 2: Get total count of purchased certifications
      db.enrolledStudents.count({
        where: {
          studentProfileId: studentProfile.id,
          certification: { isPublished: true },
        },
      }),

      // Query 3: Get all progress data for this user
      db.progress.findMany({
        where: {
          studentProfileId: studentProfile.id,
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

  const certifications = purchasedCertificationCoursesData.map(
    (item) => item.certification
  );
  const total = totalCount;

  // Create progress lookup map
  // const completedLessonsMap = new Map<string, Set<string>>();
  // allProgressData.forEach((progress) => {
  //   const courseId = progress.lesson.courseId;
  //   if (!completedLessonsMap.has(courseId)) {
  //     completedLessonsMap.set(courseId, new Set());
  //   }
  //   completedLessonsMap.get(courseId)!.add(progress.lessonId);
  // });

  // Process certifications with progress
  // const processedCertificationCourses = certifications.map((course: any) => {
  //   const lessons = course.lessons || [];
  //   const completedLessons = completedLessonsMap.get(course.id) || new Set();

  //   const totalLessons = lessons.length;
  //   const completedCount = completedLessons.size;
  //   const progress =
  //     totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  //   const nextLesson = lessons.find(
  //     (lesson: any) => !completedLessons.has(lesson.id)
  //   );
  //   const nextLessonSlug = nextLesson?.slug || lessons[0]?.slug || null;

  //   return {
  //     ...course,
  //     progress,
  //     nextLessonSlug,
  //     totalLessons,
  //     completedLessons: completedCount,
  //   };
  // });

  const hasMore = offset + limit < total;

  return NextResponse.json({
    certifications,
    totalCount: total,
    hasMore: hasMore,
    nextCursor: hasMore ? offset + limit : undefined,
  });
}

async function handleRegisteredEvents(
  userId: string,
  offset: number,
  limit: number
) {
  // console.log(`[API] Handling registered events - offset: ${offset}, limit: ${limit}`);

  try {
    // Get paginated registered events using EventRegistration
    const [events, totalCount] = await Promise.all([
      db.eventRegistration.findMany({
        where: {
          userId: userId,
        },
        select: {
          id: true,
          registeredAt: true,
          event: {
            select: {
              id: true,
              title: true,
              description: true,
              slug: true,
              imageUrl: true,
              date: true,
              location: true,
              zoomLink: true,
              isOnline: true,
              price: true,
              type: true,
              status: true,
              speakers: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { registeredAt: "desc" },
      }),

      // Get total count
      db.eventRegistration.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    // console.log(`[API] Found ${events.length} registered events for this page, ${totalCount} total`);

    const hasMore = offset + limit < totalCount;

    // console.log(`[API] Returning registered events - hasMore: ${hasMore}, nextCursor: ${hasMore ? offset + limit : undefined}`);

    return NextResponse.json({
      events,
      totalCount,
      hasMore: hasMore,
      nextCursor: hasMore ? offset + limit : undefined,
    });
  } catch (error) {
    console.error("[HANDLE_REGISTERED_EVENTS]", error);
    return NextResponse.json({
      events: [],
      totalCount: 0,
      hasMore: false,
      nextCursor: undefined,
    });
  }
}
