
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { certificationId: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const certification = await db.certification.findUnique({
      where: {
        id: params.certificationId,
      },
    });

    if (!certification) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check required fields for publishing
    const hasRequiredFields = certification.title  && certification.slug && certification.courseIds;

    // if (!hasRequiredFields || !hasPublishedLesson) {
    if (!hasRequiredFields) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    const publishedCertification = await db.certification.update({
      where: {
        id: params.certificationId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCertification);
  } catch (error) {
    console.error("[CERTIFICATION_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
