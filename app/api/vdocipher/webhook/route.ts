// api/vdocipher/webhook/route.ts
import { db } from "@/lib/db";
import updateCourseDuration from "@/lib/utils/updateCourseDuration";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  payload: {
    id: string;
    length: number;
  };
  event: string;
}

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();

  const videoId = body.payload.id;
  const duration = body.payload.length;

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const vdocipherToken = process.env.VDOCHIPER_HOOK_TOKEN;

  try {
    if (vdocipherToken !== token) {
      throw new Error("Token does not match");
    }

    if (body.event === "video:ready") {
      const existedLesson = await db.lesson.findFirst({
        where: {
          videoUrl: videoId,
        },
      });

      if (!existedLesson) {
        throw new Error("Lesson not found");
      }

      await db.lesson.update({
        where: {
          id: existedLesson.id,
        },
        data: {
          videoStatus: "READY",
          duration,
        },
      });

      const existingVideoRecord = await db.vdocipherUploads.findFirst({
        where: {
          videoId: videoId,
        },
      });

      if (existingVideoRecord) {
        await db.vdocipherUploads.update({
          where: {
            id: existingVideoRecord.id,
          },
          data: {
            duration: duration,
            videoStatus: "READY",
            updatedAt: new Date(),
            payload: body.payload,
          },
        });
      } else {
        console.warn(`No vdocpherVideo record found for video ${videoId}`);
      }

      await updateCourseDuration(existedLesson.courseId);

      return NextResponse.json(
        {
          success: true,
          message: "Lesson updated successfully",
        },
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    throw new Error("Event type not supported");
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      {
        error: true,
        message: error.message,
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
