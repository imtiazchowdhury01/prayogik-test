// api/user/[courseId]/attachments/[attachmentId]/route.ts
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const teacherProfileId = await useTeacherProfile(userId);

    const courseOwner = await db.course.findFirst({
      where: {
        id: params.courseId,
        teacherProfileId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingAttachment = await db.attachment.findUnique({
      where: {
        id: params.attachmentId,
      },
    });

    if (
      !existingAttachment ||
      existingAttachment.courseId !== params.courseId
    ) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    const deletedAttachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
      },
    });

    return NextResponse.json(deletedAttachment);
  } catch (error) {
    console.error("ATTACHMENT_DELETE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
