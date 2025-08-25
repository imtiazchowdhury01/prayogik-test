"use server";

import { CourseMode } from "@prisma/client";
import { db } from "../db";

async function getHomeCoursesDBCall() {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        courseMode: CourseMode.RECORDED,
      },
      include: {
        prices: true,
        teacherProfile: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        enrolledStudents: {
          select: {
            id: true,
          },
        },
      },
      take: 8, // Limit to 8 courses
      orderBy: { updatedAt: "desc" },
    });

    return courses;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
}

async function getLiveCoursesDBCall() {
  try {
    // Fetching subscription plans along with subscription discounts
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        courseMode: CourseMode.LIVE,
      },
      omit: {
        courseLiveLinkPassword: true,
        learningOutcomes: true,
        whoFor: true,
        isUnderSubscription: true,
        membershipPlanIds: true,
      },
      include: {
        prices: true,
        teacherProfile: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        enrolledStudents: {
          select: {
            id: true,
          },
        },
      },
      take: 8, // Limit to 8 courses
      orderBy: { updatedAt: "desc" },
    });
    return courses;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
}

export { getHomeCoursesDBCall, getLiveCoursesDBCall };
