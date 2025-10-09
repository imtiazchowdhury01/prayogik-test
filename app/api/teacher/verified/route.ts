// api/teacher/verified/route.ts
export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const teachers = await db.user.findMany({
      where: {
        teacherProfile: {
          teacherStatus: "VERIFIED",
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
    });

    return NextResponse.json(teachers);
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
