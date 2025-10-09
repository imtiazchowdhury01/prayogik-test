// actions/get-analytics.ts
"use server";

import { db } from "@/lib/db";

type AnalyticsData = {
  name: string;
  total: number;
};

type AnalyticsResponse = {
  data: AnalyticsData[];
  totalRevenue: number;
  totalSales: number;
};

export const getAnalytics = async (
  userId: string
): Promise<AnalyticsResponse> => {
  try {
    // Get teacher profile for the user
    const teacherProfile = await db.teacherProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!teacherProfile) {
      return {
        data: [],
        totalRevenue: 0,
        totalSales: 0,
      };
    }

    // Get all purchases for courses taught by this teacher
    const purchases = await db.purchase.findMany({
      where: {
        teacherProfileId: teacherProfile.id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        teacherRevenue: {
          select: {
            amount: true,
          },
        },
      },
    });

    // Calculate revenue by course
    const courseRevenue: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
      const courseTitle = purchase.course?.title || "Unknown Course";
      const teacherEarnings =
        purchase.teacherRevenue?.reduce(
          (sum, revenue) => sum + (revenue.amount || 0),
          0
        ) || 0;

      if (!courseRevenue[courseTitle]) {
        courseRevenue[courseTitle] = 0;
      }

      courseRevenue[courseTitle] += teacherEarnings;
    });

    // Transform data for charts
    const data: AnalyticsData[] = Object.entries(courseRevenue).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total || 0,
      })
    );

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
