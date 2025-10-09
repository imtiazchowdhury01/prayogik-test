// api/courses/[courseId]/attachments/[attachmentId]/route.ts
import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
    attachmentId: string;
  };
}

type Attachment = Prisma.AttachmentGetPayload<{}>;

interface ErrorResponse {
  error: string;
}

// ========== DELETE HANDLER ==========

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Attachment | ErrorResponse>> {
  try {
    const { courseId, attachmentId } = params;

    if (!courseId || !attachmentId) {
      return NextResponse.json(
        { error: "Missing courseId or attachmentId" },
        { status: 400 }
      );
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify course ownership or co-teaching
    const courseOwner = await useCourseByTeacherOrCoTeacher(userId, courseId);

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify attachment exists and belongs to the course
    const existingAttachment = await db.attachment.findUnique({
      where: {
        id: attachmentId,
      },
    });

    if (!existingAttachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    if (existingAttachment.courseId !== courseId) {
      return NextResponse.json(
        { error: "Attachment does not belong to this course" },
        { status: 403 }
      );
    }

    // Delete the attachment
    const deletedAttachment = await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    return NextResponse.json(deletedAttachment);
  } catch (error) {
    console.error("[ATTACHMENT_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
