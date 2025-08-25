// @ts-nocheck
import {
  useCourseByTeacherOrCoTeacher,
  useTeacherProfile,
} from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";
import updateCourseDuration from "@/lib/utils/updateCourseDuration";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);
    const teacherProfileId = await useTeacherProfile(userId);

    if (!userId) {
      return new NextResponse("Not Authenticated", { status: 401 });
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If not admin, check if user has permission to publish this lesson
      if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        courseId: params.courseId,
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    if (!lesson.title) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    const publishedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
      },
      data: {
        isPublished: true,
        updatedAt: new Date(),
      },
    });

    // update total duration of the course by using the helper function
    await updateCourseDuration(params.courseId);
    return NextResponse.json(publishedLesson);
  } catch (error) {
    console.error("[LESSON_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
