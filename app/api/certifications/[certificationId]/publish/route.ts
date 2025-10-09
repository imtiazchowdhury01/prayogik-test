// api/certifications/[certificationId]/publish/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    certificationId: string;
  };
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { certificationId } = params;

    if (!certificationId) {
      return new NextResponse("Missing certificationId", { status: 400 });
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userIsTeacher = await isTeacher(userId);

    if (!isAdmin && !userIsTeacher) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const certification = await db.certification.findUnique({
      where: { id: certificationId },
      select: {
        title: true,
        slug: true,
        courseIds: true,
      },
    });

    if (!certification) {
      return new NextResponse("Certification not found", { status: 404 });
    }

    const hasRequiredFields =
      certification.title &&
      certification.slug &&
      certification.courseIds &&
      certification.courseIds.length > 0;

    if (!hasRequiredFields) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    const publishedCertification = await db.certification.update({
      where: { id: certificationId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCertification);
  } catch (error) {
    console.error("[CERTIFICATION_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
