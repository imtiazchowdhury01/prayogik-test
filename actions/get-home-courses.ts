// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getProgress } from "./get-progress";

export async function getHomeCourses() {
  const { userId } = await getServerUserSession();

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

    return coursesWithProgress;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }
}
