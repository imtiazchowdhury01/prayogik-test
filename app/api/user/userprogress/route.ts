// api/user/userprogress/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");

  if (!userId || !courseId) {
    return NextResponse.json(
      { error: "Missing userId or courseId" },
      { status: 400 }
    );
  }

  try {
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const progress = await db.progress.findMany({
      where: {
        studentProfileId: studentProfile.id,
        lesson: {
          courseId: courseId,
        },
      },
      select: {
        lesson: {
          select: {
            id: true,
            title: true,
            isPublished: true,
            isFree: true,
            slug: true,
            position: true,
            duration: true,
          },
        },
        id: true,
        isCompleted: true,
        lessonId: true,
        studentProfileId: true,
      },
    });

    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Error fetching user progress" },
      { status: 500 }
    );
  }
}
