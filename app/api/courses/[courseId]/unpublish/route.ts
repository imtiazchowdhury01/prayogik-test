// api/courses/[courseId]/unpublish/route.ts
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

type UnpublishedCourse = Prisma.CourseGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    isPublished: true;
  };
}>;

// ========== PATCH HANDLER ==========

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<UnpublishedCourse | { error: string }>> {
  try {
    const { courseId } = params;

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin or teacher
    const userIsTeacher = await isTeacher(userId);

    if (!isAdmin && !userIsTeacher) {
      return new NextResponse("Unauthorized - Not a teacher or admin", {
        status: 401,
      });
    }

    // If not admin, verify ownership/co-teaching
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(userId, courseId);

      if (!ownCourse) {
        return new NextResponse(
          "Unauthorized - You don't have permission to unpublish this course",
          { status: 401 }
        );
      }
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if already unpublished
    if (!course.isPublished) {
      return NextResponse.json(
        { error: "Course is already unpublished" },
        { status: 400 }
      );
    }

    // Unpublish the course
    const unpublishedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: false,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error: any) {
    console.error("[COURSE_UNPUBLISH_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
