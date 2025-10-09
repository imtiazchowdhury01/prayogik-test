// api/certifications/[certificationId]/unpublish/route.ts
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
        id: true,
        isPublished: true,
      },
    });

    if (!certification) {
      return new NextResponse("Certification not found", { status: 404 });
    }

    if (!certification.isPublished) {
      return NextResponse.json(
        { message: "Certification is already unpublished" },
        { status: 400 }
      );
    }

    const unpublishedCertification = await db.certification.update({
      where: { id: certificationId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedCertification);
  } catch (error) {
    console.error("[CERTIFICATION_UNPUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
