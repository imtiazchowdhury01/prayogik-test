// api/certifications/[certificationId]/access/route.ts
import { getServerUserSession } from "@/lib/getServerUserSession";
import { canAccessCertification, getCertificationById } from "@/services/user";
import { NextRequest, NextResponse } from "next/server";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    certificationId: string;
  };
}

interface AccessResponse {
  access: boolean;
  error?: string;
  reason?: string;
  nextLessonAndCourseSlug?: string | null;
}

// ========== HELPER FUNCTIONS ==========

const createErrorResponse = (
  error: string,
  status: number = 400
): NextResponse<AccessResponse> => {
  return NextResponse.json(
    { access: false, error, nextLessonAndCourseSlug: null },
    { status }
  );
};

const createSuccessResponse = (
  reason?: string,
  nextLessonAndCourseSlug?: string
): NextResponse<AccessResponse> => {
  return NextResponse.json({
    access: true,
    reason,
    nextLessonAndCourseSlug,
  });
};

// ========== GET HANDLER ==========

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<AccessResponse>> {
  try {
    const { certificationId } = params;

    if (!certificationId) {
      return createErrorResponse("Missing certificationId", 400);
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return createErrorResponse("Unauthorized", 401);
    }

    const certification = await getCertificationById(certificationId);

    if (!certification) {
      return createErrorResponse("Certification not found", 404);
    }

    const accessResult = await canAccessCertification(userId, certificationId);

    if (!accessResult.access) {
      const errorMessages: Record<string, { message: string; status: number }> =
        {
          no_access: {
            message: "You don't have access to this certification",
            status: 403,
          },
        };

      const errorKey =
        accessResult.reason === "no_access" ? accessResult.reason : "no_access";

      const error = errorMessages[errorKey];

      return createErrorResponse(error.message, error.status);
    }

    // Get first lesson of first course
    let nextLessonAndCourseSlug: string | undefined;

    if (
      certification.courses &&
      certification.courses.length > 0 &&
      certification.courses[0].lessons &&
      certification.courses[0].lessons.length > 0
    ) {
      const firstCourse = certification.courses[0];
      const firstLesson = firstCourse.lessons[0];
      nextLessonAndCourseSlug = `${firstCourse.slug}/${firstLesson.slug}`;
    }

    return createSuccessResponse(accessResult.reason, nextLessonAndCourseSlug);
  } catch (error) {
    console.error("[CERTIFICATION_ACCESS_ERROR]", error);
    return NextResponse.json(
      {
        access: false,
        error: "Internal server error",
        nextLessonAndCourseSlug: null,
      },
      { status: 500 }
    );
  }
}
