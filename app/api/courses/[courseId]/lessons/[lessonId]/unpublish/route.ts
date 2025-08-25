// @ts-nocheck
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import {
  useCoTeacherProfileId,
  useCourseByTeacherOrCoTeacher,
  useTeacherProfile,
} from "@/hooks/useTeacherProfile";
import updateCourseDuration from "@/lib/utils/updateCourseDuration";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Not Authenticated", { status: 401 });
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If not admin, check if user has permission to unpublish this lesson
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const unpublishedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
        updatedAt: new Date(),
      },
    });

    const publishedChaptersInCourse = await db.lesson.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
          updatedAt: new Date(),
        },
      });
    }

    // update total duration of the course by using the helper function
    await updateCourseDuration(params.courseId);
    return NextResponse.json(unpublishedLesson);
  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
