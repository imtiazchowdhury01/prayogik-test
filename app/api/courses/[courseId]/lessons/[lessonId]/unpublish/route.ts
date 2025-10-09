// api/courses/[courseId]/lessons/[lessonId]/unpublish/route.ts
import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";
import updateCourseDuration from "@/lib/utils/updateCourseDuration";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { courseId, lessonId } = params;

    if (!courseId || !lessonId) {
      return new NextResponse("Missing courseId or lessonId", { status: 400 });
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Not Authenticated", { status: 401 });
    }

    const userIsTeacher = await isTeacher(userId);

    if (!isAdmin && !userIsTeacher) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(userId, courseId);

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const unpublishedLesson = await db.lesson.update({
      where: {
        id: lessonId,
        courseId,
      },
      data: {
        isPublished: false,
        updatedAt: new Date(),
      },
    });

    const publishedLessonsCount = await db.lesson.count({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedLessonsCount === 0) {
      await db.course.update({
        where: { id: courseId },
        data: {
          isPublished: false,
          updatedAt: new Date(),
        },
      });
    }

    await updateCourseDuration(courseId);

    return NextResponse.json(unpublishedLesson);
  } catch (error) {
    console.error("[LESSON_UNPUBLISH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
