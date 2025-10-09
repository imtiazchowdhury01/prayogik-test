// api/teacher/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const teachers = await db.user.findMany({
      where: {
        teacherProfile: {
          teacherStatus: { not: "NONE" },
        },
      },
      select: {
        name: true,
        email: true,
        emailVerified: true,
        teacherProfile: {
          select: {
            id: true,
            teacherStatus: true,
            teacherRank: true,
          },
        },
      },
    });

    if (!teachers.length) {
      return NextResponse.json(
        { error: "Teachers not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch teachers." },
      { status: 500 }
    );
  }
}
