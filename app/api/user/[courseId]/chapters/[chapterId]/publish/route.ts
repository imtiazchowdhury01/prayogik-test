// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

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

    const chapter = await db.lesson.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter Not Found", { status: 404 });
    }

    if (!chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    const publishedChapter = await db.lesson.update({
      where: {
        id: params.chapterId,
      },
      data: {
        isPublished: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.error("[CHAPTER_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
