// api/courses/[courseId]/attachments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
  };
}

interface CreateAttachmentRequest {
  url: string;
}

type Attachment = Prisma.AttachmentGetPayload<{}>;

interface ErrorResponse {
  error: string;
}

// ========== POST HANDLER ==========

export async function POST(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Attachment | ErrorResponse>> {
  try {
    const { courseId } = params;

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: CreateAttachmentRequest = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing URL" },
        { status: 400 }
      );
    }

    // Verify course ownership or co-teaching
    const courseOwner = await useCourseByTeacherOrCoTeacher(userId, courseId);

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Extract filename from URL
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1] || "attachment";

    const attachment = await db.attachment.create({
      data: {
        url,
        name: filename,
        courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[CREATE_ATTACHMENT_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
