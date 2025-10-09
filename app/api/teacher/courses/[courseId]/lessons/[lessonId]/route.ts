// api/teacher/courses/[courseId]/lessons/[lessonId]/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { lessonId: string; courseId: string } }
) {
  const { userId } = await getServerUserSession();
  const { lessonId, courseId } = params;

  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    const lesson = await db.lesson.findFirst({
      where: {
        id: lessonId,
        courseId: courseId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch lesson." },
      { status: 500 }
    );
  }
}
