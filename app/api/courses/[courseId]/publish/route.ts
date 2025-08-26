import {
  useCoTeacherProfileId,
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
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If not admin, check if user has permission to publish this course
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        lessons: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check required fields for publishing
    const hasRequiredFields = course.title && course.categoryId;
    const hasPublishedLesson = course.lessons.some(
      (lesson) => lesson.isPublished
    );

    if (!hasRequiredFields || !hasPublishedLesson) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    // Update total duration of the course
    await updateCourseDuration(params.courseId);
    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error("[COURSE_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
