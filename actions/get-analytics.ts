// @ts-nocheck

import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    const coursePrice = purchase.course.price ?? 0;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += coursePrice;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            teacher: true,
          },
        },
        TeacherRevenue: true,
      },
    });

    const courseRevenue: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
      const courseTitle = purchase.course?.title || "Unknown Course";
      const teacherEarnings =
        purchase.TeacherRevenue?.reduce(
          (sum, revenue) => sum + (revenue.amount || 0),
          0
        ) || 0;

      if (!courseRevenue[courseTitle]) {
        courseRevenue[courseTitle] = 0;
      }
      courseRevenue[courseTitle] += teacherEarnings;
    });

    const data = Object.entries(courseRevenue).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total || 0,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + (curr.total || 0), 0);

    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
