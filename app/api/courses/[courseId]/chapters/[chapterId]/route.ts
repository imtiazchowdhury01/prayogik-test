// @ts-nocheck
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
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

    const { videoUrl, ...values } = await req.json();

    if (videoUrl && typeof videoUrl !== "string") {
      return new NextResponse("Invalid video URL", { status: 400 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId: teacherProfileId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedChapter = await db.lesson.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
        videoUrl: videoUrl ?? undefined,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
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

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[GET_CHAPTER_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
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

    const videoId = chapter.videoUrl;
    if (!videoId) {
      return new NextResponse("Video ID is required", { status: 400 });
    }

    const apiSecret = process.env.VDOCIPHER_API_SECRET;
    if (!apiSecret) {
      throw new Error("API Secret is not defined.");
    }

    const url = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${apiSecret}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Response from VdoCipher: ${errorText}`);
        throw new Error(
          `Failed to delete video ${videoId}: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
    } catch (videoError) {
      const videoErrorMessage =
        videoError instanceof Error ? videoError.message : "Unknown error";
      console.error(
        `Failed to delete video ${videoId} from VdoCipher`,
        videoErrorMessage
      );
      return new NextResponse(
        `Failed to delete video from VdoCipher: ${videoErrorMessage}`,
        { status: 500 }
      );
    }

    await db.progress.deleteMany({
      where: {
        id: chapter.id,
      },
    });

    const deletedChapter = await db.lesson.delete({
      where: {
        id: params.chapterId,
      },
    });

    const remainingPublishedChapters = await db.lesson.count({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (remainingPublishedChapters === 0) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[CHAPTER_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
