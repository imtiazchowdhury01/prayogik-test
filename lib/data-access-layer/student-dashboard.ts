"use server";

import { db } from "../db";

export async function getDashboardMetricsWithTrendsDBCall(userId: string) {
  try {
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!studentProfile) {
      return {
        purchasedCourses: 0,
        subscriptionCourses: 0,
        registeredEvents: 0,
        trends: {
          purchasedCoursesLastMonth: 0,
          newSubscriptionCourses: 0,
          eventsThisWeek: 0,
        },
      };
    }

    // Current date calculations
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get current metrics
    const [
      purchasedCoursesCount,
      purchasedCoursesLastMonthCount,
      activeSubscription,
      registeredEventsCount,
      eventsThisWeekCount,
    ] = await Promise.all([
      // Current purchased courses - Fixed: Only count course purchases
      db.enrolledStudents.count({
        where: {
          studentProfileId: studentProfile.id,
        },
      }),

      // Purchased courses from last month
      db.purchase.count({
        where: {
          studentProfileId: studentProfile.id,
          purchaseType: { in: ["SINGLE_COURSE", "TRIAL", "OFFER"] },
          courseId: { not: null },
          createdAt: { gte: lastMonth },
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
      }),

      // Active subscription with courses
      db.subscription.findFirst({
        where: {
          studentProfileId: studentProfile.id,
          OR: [
            {
              status: "ACTIVE",
              expiresAt: { gt: now },
            },
            {
              status: "ACTIVE",
              isTrial: true,
              trialEndsAt: { gt: now },
            },
          ],
        },
        include: {
          subscriptionPlan: {
            include: {
              courses: true,
            },
          },
        },
      }),

      // Total registered events - Fixed: Remove isPublished filter or make it optional
      db.eventRegistration.count({
        where: {
          userId,
          event: {
            date: { gt: now },
            status: {
              in: ["UPCOMING", "CLOSED"],
            },
          },
        },
      }),

      // Events in the next week
      db.eventRegistration.count({
        where: {
          userId,
          event: {
            date: { gte: now, lte: oneWeekFromNow },
          },
        },
      }),
    ]);

    const subscriptionCoursesCount = await db.course.count({
      where: {
        isUnderSubscription: true,
        isPublished: true,
      },
    });

    // console.log("purchasedCoursesCount result:", purchasedCoursesCount);
    return {
      purchasedCourses: purchasedCoursesCount,
      subscriptionCourses: subscriptionCoursesCount,
      registeredEvents: registeredEventsCount,
      trends: {
        purchasedCoursesLastMonth: purchasedCoursesLastMonthCount,
        newSubscriptionCourses: activeSubscription
          ? subscriptionCoursesCount
          : 0,
        eventsThisWeek: eventsThisWeekCount,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics with trends:", error);

    return {
      purchasedCourses: 0,
      subscriptionCourses: 0,
      registeredEvents: 0,
      trends: {
        purchasedCoursesLastMonth: 0,
        newSubscriptionCourses: 0,
        eventsThisWeek: 0,
      },
    };
  }
}
