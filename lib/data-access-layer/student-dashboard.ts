"use server";

import { cache } from "react";
import { db } from "../db";

export const getDashboardMetricsWithTrendsDBCall = cache(
  async (userId: string) => {
    try {
      const studentProfile = await db.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!studentProfile) {
        return {
          purchasedCourses: 0,
          purchasedCertificationCoursesCount: 0,
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
        purchasedCertificationCoursesCount,
        purchasedCoursesLastMonthCount,
        activeSubscription,
        registeredEventsCount,
        eventsThisWeekCount,
      ] = await Promise.all([
        // Current purchased courses - Fixed: Only count course purchases(purchasedCoursesCount)
        db.enrolledStudents.count({
          where: {
            studentProfileId: studentProfile.id,
            course: { isPublished: true },
          },
        }),

        // purchased certification courses count
        db.enrolledStudents.count({
          where: {
            studentProfileId: studentProfile.id,
            certification: { isPublished: true },
          },
        }),

        // Purchased courses from last month(purchasedCoursesLastMonthCount)
        db.purchase.count({
          where: {
            studentProfileId: studentProfile.id,
            purchaseType: { in: ["SINGLE_COURSE", "TRIAL", "OFFER"] },
            courseId: { not: null },
            createdAt: { gte: lastMonth },
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          },
        }),

        // Active subscription with courses and trial info(activeSubscription)
        db.subscription.findFirst({
          where: {
            studentProfileId: studentProfile.id,
            // OR: [
            //   {
            //     status: "ACTIVE",
            //     expiresAt: { gt: now },
            //   },
            //   {
            //     status: "ACTIVE",
            //     isTrial: true,
            //     trialEndsAt: { gt: now },
            //   },
            // ],
          },
          select: {
            isTrial: true,
            trialSelectedCourseIds: true,
            subscriptionPlan: {
              select: {
                isTrial: true,
                courses: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        }),

        // Total registered events - Fixed: Remove isPublished filter or make it optional(registeredEventsCount)
        db.eventRegistration.count({
          where: {
            userId,
            // event: {
            //   date: { gt: now },
            //   status: {
            //     in: ["UPCOMING", "CLOSED"],
            //   },
            // },
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

      // Initialize subscription courses count
      let subscriptionCoursesCount = 0;
      let newSubscriptionCourses = 0;

      // Only calculate subscription courses if user has an active subscription
      if (activeSubscription) {
        // Get purchased course IDs to exclude from subscription count
        const enrolledCourseIds = await db.enrolledStudents.findMany({
          where: { studentProfileId: studentProfile.id },
          select: { courseId: true },
        });

        // const purchasedCourseIds = enrolledCourseIds.map((item) => item.courseId);

        if (
          activeSubscription.subscriptionPlan?.isTrial &&
          activeSubscription.trialSelectedCourseIds?.length > 0
        ) {
          // For trial subscriptions, count only selected courses that aren't already purchased
          subscriptionCoursesCount = await db.course.count({
            where: {
              id: {
                in: activeSubscription.trialSelectedCourseIds,
                // notIn: purchasedCourseIds,
              },
              isPublished: true,
            },
          });
        } else {
          // For regular subscriptions, count all subscription courses that aren't already purchased
          subscriptionCoursesCount = await db.course.count({
            where: {
              isUnderSubscription: true,
              isPublished: true,
              // id: { notIn: purchasedCourseIds },
            },
          });
        }

        newSubscriptionCourses = subscriptionCoursesCount;
      }
      // If no active subscription, counts remain 0 (initialized above)

      return {
        purchasedCourses: purchasedCoursesCount,
        purchasedCertificationCoursesCount: purchasedCertificationCoursesCount,
        subscriptionCourses: subscriptionCoursesCount,
        registeredEvents: registeredEventsCount,
        trends: {
          purchasedCoursesLastMonth: purchasedCoursesLastMonthCount,
          newSubscriptionCourses: newSubscriptionCourses,
          eventsThisWeek: eventsThisWeekCount,
        },
        // Additional info for debugging
        subscriptionInfo: {
          hasActiveSubscription: !!activeSubscription,
          isTrial: activeSubscription?.isTrial || false,
          trialCoursesSelected: activeSubscription?.isTrial
            ? activeSubscription.trialSelectedCourseIds?.length || 0
            : 0,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics with trends:", error);

      return {
        purchasedCourses: 0,
        purchasedCertificationCoursesCount: 0,
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
);
