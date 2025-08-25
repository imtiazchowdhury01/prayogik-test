// @ts-nocheck

import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
       const teacherProfileId = await useTeacherProfile(userId);

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const hasRequiredFields = course.title && course.categoryId;

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (!hasRequiredFields || !hasPublishedChapter) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        teacherProfileId,
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
