// api/user/[courseId]/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function DELETE(
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
        attachments: true,
        lessons: true,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (course.attachments.length > 0) {
      await db.attachment.deleteMany({
        where: {
          courseId: params.courseId,
        },
      });
    }

    if (course.lessons.length > 0) {
      for (const lesson of course.lessons) {
        const videoId = lesson.videoUrl;
        if (videoId) {
          const apiSecret = process.env.VDOCIPHER_API_SECRET;
          if (!apiSecret) {
            throw new Error("API Secret is not defined.");
          }

          const url = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;

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
        }
      }

      await db.lesson.deleteMany({
        where: {
          courseId: params.courseId,
        },
      });
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession();
    const { courseId } = params;

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

    const values = await req.json();

    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    const existingCourse = await db.course.findFirst({
      where: {
        id: courseId,
        teacherProfileId: teacherProfile.id,
      },
    });

    if (!existingCourse) {
      return new NextResponse("Not found", { status: 404 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSE_ID_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
