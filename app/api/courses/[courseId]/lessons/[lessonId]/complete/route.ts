import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, courseId } = await req.json();

    if (!lessonId || !courseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get student profile
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId: userId },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Check if already completed
    const existingProgress = await db.progress.findUnique({
      where: {
        studentProfileId_lessonId: {
          studentProfileId: studentProfile.id,
          lessonId: lessonId,
        },
      },
    });

    if (existingProgress?.isCompleted) {
      return NextResponse.json({
        message: "Already completed",
        isCompleted: true,
      });
    }

    // Mark as complete
    const progress = await db.progress.upsert({
      where: {
        studentProfileId_lessonId: {
          studentProfileId: studentProfile.id,
          lessonId: lessonId,
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        studentProfileId: studentProfile.id,
        lessonId: lessonId,
        isCompleted: true,
      },
    });

    // Calculate course progress
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          where: { isPublished: true },
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

    const progressPercentage = Math.round(
      (completedLessons / course.lessons.length) * 100
    );

    return NextResponse.json({
      success: true,
      isCompleted: true,
      progress: progressPercentage,
    });
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
