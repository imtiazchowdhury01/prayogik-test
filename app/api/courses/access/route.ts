// api/courses/access/route.ts
import {
  canAccessCourse,
  getCourseBySlug,
  getNextLessonSlug,
} from "@/services/user";
import { NextRequest, NextResponse } from "next/server";

// ========== TYPE DEFINITIONS ==========

interface CourseAccessRequest {
  courseSlug: string;
  userId: string;
}

interface CourseAccessResponse {
  access: boolean;
  error?: string;
  nextLessonSlug: string | null;
  reason?: string;
}

type AccessDenialReason = "no_access";

// ========== RESPONSE HELPERS ==========

const createErrorResponse = (
  error: string,
  status: number = 400
): NextResponse<CourseAccessResponse> => {
  return NextResponse.json(
    { access: false, error, nextLessonSlug: null },
    { status }
  );
};

const createSuccessResponse = (
  nextLessonSlug: string | null = null,
  reason?: string
): NextResponse<CourseAccessResponse> => {
  return NextResponse.json({
    access: true,
    nextLessonSlug,
    reason,
  });
};

// ========== API ROUTE HANDLER ==========

export async function POST(
  req: NextRequest
): Promise<NextResponse<CourseAccessResponse>> {
  try {
    const body: CourseAccessRequest = await req.json();
    const { courseSlug, userId } = body;

    // Validate required fields
    if (!courseSlug || !userId) {
      return createErrorResponse("Missing courseSlug or userId", 400);
    }

    // Get course details by slug
    const course = await getCourseBySlug(courseSlug);

    if (!course) {
      return createErrorResponse("Course not found", 404);
    }

    // Check course access
    const accessResult = await canAccessCourse(userId, course.id);

    if (!accessResult.access) {
      // Map access denial reasons to error messages
      const errorMessages: Record<
        AccessDenialReason,
        { message: string; status: number }
      > = {
        no_access: {
          message: "You don't have access to this course",
          status: 403,
        },
      };

      // Type-safe access to error messages
      const errorKey =
        accessResult.reason === "no_access" ? accessResult.reason : "no_access";

      const error = errorMessages[errorKey];

      return createErrorResponse(error.message, error.status);
    }

    // Get next lesson slug for users with access
    let nextLessonSlug: string | null = null;

    if (course._count.lessons > 0) {
      nextLessonSlug = await getNextLessonSlug(userId, course.id);
    }

    return createSuccessResponse(nextLessonSlug, accessResult.reason);
  } catch (error) {
    console.error("Error checking course access:", error);
    return NextResponse.json(
      {
        access: false,
        error: "Internal server error",
        nextLessonSlug: null,
      },
      { status: 500 }
    );
  }
}
