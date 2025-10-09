import { getServerUserSession } from "@/lib/getServerUserSession";
import { canAccessCertification, getCertificationById } from "@/services/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { certificationId: string } }
) {
  try {
    const { certificationId } = params;
    const { userId } = await getServerUserSession(req);

    // Validate required fields
    if (!certificationId || !userId) {
      return createErrorResponse("Missing certificationId or userId", 400);
    }

    // Get certification details by ID
    const certification = await getCertificationById(certificationId);
    if (!certification) {
      return createErrorResponse("Certification not found", 404);
    }

    // Check certification access using the refactored function
    const accessResult = await canAccessCertification(userId, certificationId);
    console.log({ accessResult });

    if (!accessResult.access) {
      // Map access denial reasons to appropriate error messages and status codes
      const errorMessages = {
        no_access: {
          message: "You don't have access to this certification",
          status: 403,
        },
      };

      const error = errorMessages[
        accessResult.reason as keyof typeof errorMessages
      ] || { message: "Access denied", status: 403 };

      return createErrorResponse(error.message, error.status);
    }

    const nextLessonAndCourseSlug = `${certification.courses[0].slug}/${certification.courses[0].lessons[0].slug}`;

    return createSuccessResponse(accessResult.reason, nextLessonAndCourseSlug);
  } catch (error) {
    console.error("Error checking certification access:", error);
    return NextResponse.json(
      { access: false, error: "Internal server error", nextCourseSlug: null },
      { status: 500 }
    );
  }
}

interface CertificationAccessRequest {
  userId: string;
}

const createErrorResponse = (
  error: string,
  status: number = 400
): NextResponse => {
  return NextResponse.json(
    { access: false, error, nextLessonAndCourseSlug: null },
    { status }
  );
};

const createSuccessResponse = (
  reason?: string,
  nextLessonAndCourseSlug?: string
): NextResponse => {
  return NextResponse.json({ access: true, reason, nextLessonAndCourseSlug });
};
