// api/courses/[courseId]/lessons/reorder/route.ts
import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
  };
}

interface ReorderItem {
  id: string;
  position: number;
}

interface ReorderRequest {
  list: ReorderItem[];
}

// ========== PUT HANDLER ==========

export async function PUT(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { courseId } = params;

    if (!courseId) {
      return new NextResponse("Missing courseId", { status: 400 });
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: ReorderRequest = await req.json();
    const { list } = body;

    if (!list || !Array.isArray(list) || list.length === 0) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    // Verify ownership if not admin
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(userId, courseId);

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const startTime = Date.now();

    // Update all lessons in parallel
    await Promise.all(
      list.map((item) =>
        db.lesson.update({
          where: { id: item.id },
          data: {
            position: item.position,
            updatedAt: new Date(),
          },
        })
      )
    );

    const duration = Date.now() - startTime;
    console.log(
      `[REORDER_LESSONS] Updated ${list.length} lessons in ${duration}ms`
    );

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[REORDER_LESSONS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
