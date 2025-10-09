// @ts-nocheck

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();

  try {
    const baseQuery = {
      where: { isPublished: true },
      include: {
        category: true,
        lessons: { where: { isPublished: true } },
        teacher: { select: { name: true, email: true } },
        prices: true,
        Rating: true,
        Review: true,
        purchases: userId ? { where: { userId } } : false,
      },
      orderBy: { createdAt: "desc" },
    };

    const courses = await db.course.findMany(baseQuery);

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        let progressPercentage = null;
        let purchases = [];

        if (userId) {
          purchases = course.purchases || [];

          if (purchases.length > 0) {
            progressPercentage = await getProgress(userId, course.id);
          }
        }

        return {
          ...course,
          progress: progressPercentage,
          purchases,
        };
      })
    );

    return NextResponse.json(coursesWithProgress, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}
