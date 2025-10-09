// api/courses/[courseId]/lessons/route.ts
import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
  };
}

interface CreateLessonRequest {
  title: string;
  slug: string;
}

interface ErrorResponse {
  error: boolean;
  message: string;
}

type Lesson = Prisma.LessonGetPayload<{}>;

// ========== POST HANDLER (Create Lesson) ==========

export async function POST(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Lesson | ErrorResponse>> {
  try {
    const { courseId } = params;

    if (!courseId) {
      return NextResponse.json(
        { error: true, message: "Missing courseId" },
        { status: 400 }
      );
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        { error: true, message: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // Check if user is admin or teacher
    const userIsTeacher = await isTeacher(userId);

    if (!isAdmin && !userIsTeacher) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized Access - Not a teacher or admin",
        },
        { status: 401 }
      );
    }

    // If not admin, verify ownership/co-teaching
    if (!isAdmin) {
      const courseOwner = await useCourseByTeacherOrCoTeacher(userId, courseId);

      if (!courseOwner) {
        return NextResponse.json(
          {
            error: true,
            message: "Unauthorized Access - Not course owner or co-teacher",
          },
          { status: 401 }
        );
      }
    }

    const body: CreateLessonRequest = await req.json();
    const { title, slug } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: true, message: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists for this course
    const lessonWithSameSlug = await db.lesson.findFirst({
      where: {
        courseId,
        slug,
      },
    });

    if (lessonWithSameSlug) {
      return NextResponse.json(
        { error: true, message: "Slug already exists" },
        { status: 400 }
      );
    }

    // Fetch the last lesson to determine position
    const lastLesson = await db.lesson.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    // Create new lesson
    const lesson = await db.lesson.create({
      data: {
        title,
        slug,
        courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("[CREATE_LESSON_ERROR]", error);
    return NextResponse.json(
      {
        error: true,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// ========== GET HANDLER (Read All Lessons) ==========

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Lesson[] | ErrorResponse>> {
  try {
    const { courseId } = params;

    if (!courseId) {
      return NextResponse.json(
        { error: true, message: "Missing courseId" },
        { status: 400 }
      );
    }

    const lessons = await db.lesson.findMany({
      where: {
        courseId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(lessons);
  } catch (error: any) {
    console.error("[GET_LESSONS_ERROR]", error);
    return NextResponse.json(
      {
        error: true,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
