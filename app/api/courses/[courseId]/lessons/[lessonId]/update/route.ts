// api/courses/[courseId]/lessons/[lessonId]/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import { isTeacher } from "@/lib/teacher";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
    lessonId: string;
  };
}

interface UpdateRequest {
  videoUrl?: string;
  duration?: number;
  textContent?: string;
}

// ========== HELPER FUNCTION ==========

async function updateCourseTotalDuration(courseId: string): Promise<void> {
  const lessons = await db.lesson.findMany({
    where: { courseId, isPublished: true },
    select: { duration: true },
  });

  const totalDuration = lessons.reduce(
    (sum, lesson) => sum + (lesson.duration || 0),
    0
  );

  await db.course.update({
    where: { id: courseId },
    data: { totalDuration },
  });
}

// ========== PATCH HANDLER (Video Update) ==========

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const { courseId, lessonId } = params;

  if (!courseId || !lessonId) {
    return NextResponse.json(
      { error: "Missing courseId or lessonId" },
      { status: 400 }
    );
  }

  try {
    const body: UpdateRequest = await request.json();
    const { videoUrl, duration } = body;

    await db.lesson.update({
      where: { id: lessonId },
      data: {
        ...(videoUrl !== undefined && { videoUrl }),
        ...(duration !== undefined && { duration }),
      },
    });

    await updateCourseTotalDuration(courseId);

    return NextResponse.json(
      { message: "Lesson updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[UPDATE_LESSON_VIDEO_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update lesson." },
      { status: 500 }
    );
  }
}

// ========== PUT HANDLER (Text Content Update) ==========

export async function PUT(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 401 }
      );
    }

    const body: UpdateRequest & { id: string } = await req.json();
    const { id, textContent } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required." }, { status: 400 });
    }

    const userIsTeacher = await isTeacher(userId);

    if (!isAdmin && !userIsTeacher) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // Verify ownership if not admin
    if (!isAdmin) {
      const lesson = await db.lesson.findUnique({
        where: { id },
        select: { courseId: true },
      });

      if (!lesson) {
        return NextResponse.json(
          { message: "Lesson not found" },
          { status: 404 }
        );
      }

      const courseOwner = await useCourseByTeacherOrCoTeacher(
        userId,
        lesson.courseId
      );

      if (!courseOwner) {
        return NextResponse.json(
          { message: "Unauthorized Access" },
          { status: 401 }
        );
      }
    }

    const updatedLesson = await db.lesson.update({
      where: { id },
      data: {
        textContent: textContent || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedLesson, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_TEXT_CONTENT_ERROR]", error);
    return NextResponse.json(
      { message: "Error updating lesson." },
      { status: 500 }
    );
  }
}
