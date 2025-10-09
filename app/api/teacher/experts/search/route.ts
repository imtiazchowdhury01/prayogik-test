// api/teacher/experts/search/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("search") || "";

  try {
    const teachers = await db.user.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
        teacherProfile: {
          teacherStatus: "VERIFIED",
        },
      },
      include: {
        teacherProfile: {
          include: {
            teacherRank: true,
            createdCourses: {
              where: {
                isPublished: true,
              },
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(teachers);
  } catch (err) {
    console.error("Teacher search failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
