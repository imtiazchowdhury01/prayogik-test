// api/courses/[courseId]/lessons/[lessonId]/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

interface CompleteRequest {
  lessonId: string;
  courseId: string;
}

interface CompleteResponse {
  success?: boolean;
  message?: string;
  error?: string;
  isCompleted?: boolean;
  progress?: number;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<CompleteResponse>> {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CompleteRequest = await req.json();
    const { lessonId, courseId } = body;

    if (!lessonId || !courseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    const existingProgress = await db.progress.findUnique({
      where: {
        studentProfileId_lessonId: {
          studentProfileId: studentProfile.id,
          lessonId,
        },
      },
    });

    if (existingProgress?.isCompleted) {
      return NextResponse.json({
        message: "Already completed",
        isCompleted: true,
      });
    }

    await db.progress.upsert({
      where: {
        studentProfileId_lessonId: {
          studentProfileId: studentProfile.id,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        studentProfileId: studentProfile.id,
        lessonId,
        isCompleted: true,
      },
    });

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const completedLessons = await db.progress.count({
      where: {
        studentProfileId: studentProfile.id,
        lessonId: {
          in: course.lessons.map((l) => l.id),
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      course.lessons.length > 0
        ? Math.round((completedLessons / course.lessons.length) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      isCompleted: true,
      progress: progressPercentage,
    });
  } catch (error) {
    console.error("[COMPLETE_LESSON_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
