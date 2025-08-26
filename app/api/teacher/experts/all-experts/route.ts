// @ts-nocheck
import { db } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip")) || 0;

  try {
    const teachers = await db.user.findMany({
      where: {
        teacherProfile: {
          createdCourses: {
            some: {
              isPublished: true,
            },
          },
        },
      },
      include: {
        teacherProfile: {
          include: {
            teacherRank: true,
          },
        },
      },
      skip: skip,
      take: 6,
    });

    return new Response(JSON.stringify(teachers), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch teachers" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
