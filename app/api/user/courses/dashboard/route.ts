// api/user/courses/dashboard/route.ts

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab");
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const metadataOnly = searchParams.get("metadataOnly") === "true";
    const offset = page * limit;

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

      const enrolledCourses = await db.enrolledStudents.findMany({
        where: { studentProfileId: studentProfile.id },
        select: { courseId: true },
      });

      const purchasedCourseIds = enrolledCourses
        .map((item) => item.courseId)
        .filter((id): id is string => id !== null);

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

  const [purchasedCoursesData, totalCount, allProgressData] = await Promise.all(
    [
      db.enrolledStudents.findMany({
        where: {
          studentProfileId: studentProfile.id,
          courseId: { not: null },
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

      db.enrolledStudents.count({
        where: {
          studentProfileId: studentProfile.id,
          courseId: { not: null },
          course: { isPublished: true },
        },
      }),

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

  const courses = purchasedCoursesData
    .map((item) => item.course)
    .filter((course): course is NonNullable<typeof course> => course !== null);
  const total = totalCount;

  const completedLessonsMap = new Map<string, Set<string>>();
  allProgressData.forEach((progress) => {
    const courseId = progress.lesson.courseId;
    if (!completedLessonsMap.has(courseId)) {
      completedLessonsMap.set(courseId, new Set());
    }
    completedLessonsMap.get(courseId)!.add(progress.lessonId);
  });

  const processedCourses = courses.map((course) => {
    const lessons = course.lessons || [];
    const completedLessons = completedLessonsMap.get(course.id) || new Set();

    const totalLessons = lessons.length;
    const completedCount = completedLessons.size;
    const progress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const nextLesson = lessons.find(
      (lesson) => !completedLessons.has(lesson.id)
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

  if (!isSubscriber) {
    return NextResponse.json({
      courses: [],
      totalCount: 0,
      hasMore: false,
      isSubscriber: false,
      isTrial: false,
    });
  }

  const isTrial = subscription?.subscriptionPlan?.isTrial;
  const trialSelectedCourseIds = subscription?.trialSelectedCourseIds || [];

  let courseWhereCondition: any = {
    isUnderSubscription: true,
    isPublished: true,
  };

  if (isTrial && trialSelectedCourseIds.length > 0) {
    courseWhereCondition.id = {
      in: trialSelectedCourseIds,
    };
  }

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

    db.course.count({
      where: courseWhereCondition,
    }),

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

  const completedLessonsMap = new Map<string, Set<string>>();
  allProgressData.forEach((progress) => {
    const courseId = progress.lesson.courseId;
    if (!completedLessonsMap.has(courseId)) {
      completedLessonsMap.set(courseId, new Set());
    }
    completedLessonsMap.get(courseId)!.add(progress.lessonId);
  });

  const processedCourses = courses.map((course) => {
    const lessons = course.lessons || [];
    const completedLessons = completedLessonsMap.get(course.id) || new Set();

    const totalLessons = lessons.length;
    const completedCount = completedLessons.size;
    const progress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const nextLesson = lessons.find(
      (lesson) => !completedLessons.has(lesson.id)
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

async function handleCertificateCourses(
  userId: string,
  offset: number,
  limit: number
) {
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

  const [purchasedCertificationCoursesData, totalCount] = await Promise.all([
    db.enrolledStudents.findMany({
      where: {
        studentProfileId: studentProfile.id,
        certificationId: { not: null },
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

    db.enrolledStudents.count({
      where: {
        studentProfileId: studentProfile.id,
        certificationId: { not: null },
        certification: { isPublished: true },
      },
    }),
  ]);

  const certifications = purchasedCertificationCoursesData
    .map((item) => item.certification)
    .filter((cert): cert is NonNullable<typeof cert> => cert !== null);
  const total = totalCount;

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
  try {
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

      db.eventRegistration.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    const hasMore = offset + limit < totalCount;

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
