// api/courses/[courseId]/publish/route.ts
import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";
import updateCourseDuration from "@/lib/utils/updateCourseDuration";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
  };
}

type CourseWithLessons = Prisma.CourseGetPayload<{
  include: {
    lessons: true;
  };
}>;

// ========== PATCH HANDLER ==========

export async function PATCH(
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
          "Unauthorized - You don't have permission to publish this course",
          { status: 401 }
        );
      }
    }

    const course: CourseWithLessons | null = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        lessons: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check required fields for publishing
    const hasRequiredFields = course.title && course.categoryId;

    if (!hasRequiredFields) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    // Optional: Uncomment if you want to require at least one published lesson
    // const hasPublishedLesson = course.lessons.length > 0;
    // if (!hasPublishedLesson) {
    //   return new NextResponse("Course must have at least one published lesson", {
    //     status: 400,
    //   });
    // }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    // Update total duration of the course
    await updateCourseDuration(courseId);

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error("[COURSE_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
