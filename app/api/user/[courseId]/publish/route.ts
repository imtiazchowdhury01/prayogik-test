// api/user/[courseId]/publish/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!teacherProfile) {
      return new NextResponse("Teacher profile not found", { status: 404 });
    }

    const course = await db.course.findFirst({
      where: {
        id: params.courseId,
        teacherProfileId: teacherProfile.id,
      },
      include: {
        lessons: true,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const hasRequiredFields = course.title && course.categoryId;

    const hasPublishedLesson = course.lessons.some(
      (lesson) => lesson.isPublished
    );

    if (!hasRequiredFields || !hasPublishedLesson) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
