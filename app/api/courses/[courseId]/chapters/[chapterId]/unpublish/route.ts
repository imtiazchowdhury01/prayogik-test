// @ts-nocheck
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const teacherProfileId = await useTeacherProfile(userId);

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedChapter = await db.lesson.update({
      where: {
        id: params.chapterId,
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

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
