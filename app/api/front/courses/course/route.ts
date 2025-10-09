// @ts-nocheck

import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { courseSlug, userId } = await req.json();
    const studentProfileId = await useStudentProfile(userId);

    if (!courseSlug) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { slug: courseSlug },
      include: {
        purchases: userId ? { where: { userId } } : false,
        lessons: {
          where: { isPublished: true },
          include: userId
            ? { progress: { where: { studentProfileId } } }
            : false,
          orderBy: { position: "asc" },
        },
        prices: true,
        attachments: true,
        teacher: {
          select: { name: true },
        },
        category: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
