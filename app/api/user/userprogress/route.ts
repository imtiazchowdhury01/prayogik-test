import { NextResponse } from "next/server";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");

  const studentProfileId = await useStudentProfile(userId!);

  if (!userId || !courseId) {
    return NextResponse.json(
      { error: "Missing userId or courseId" },
      { status: 400 }
    );
  }

  try {
    const progress = await db.progress.findMany({
      where: {
        studentProfileId,
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
