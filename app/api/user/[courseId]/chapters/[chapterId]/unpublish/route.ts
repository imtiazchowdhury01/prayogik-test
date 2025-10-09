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

    // Ensure the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
       const teacherProfileId = await useTeacherProfile(userId);

    // Check if the course belongs to the user
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId, // Corrected to use teacherId for ownership
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Unpublish the chapter
    const unpublishedChapter = await db.lesson.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
        updatedAt: new Date(), // Optionally update the timestamp
      },
    });

    // Check for published chapters in the course
    const publishedChaptersInCourse = await db.lesson.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    // If there are no published chapters, unpublish the course
    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
          updatedAt: new Date(), // Optionally update the timestamp
        },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
