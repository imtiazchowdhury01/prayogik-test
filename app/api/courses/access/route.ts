import {
  canAccessCourse,
  getCourseBySlug,
  getNextLessonSlug,
} from "@/services/user";
import { NextRequest, NextResponse } from "next/server";

interface CourseAccessRequest {
  courseSlug: string;
  userId: string;
}

const createErrorResponse = (
  error: string,
  status: number = 400
): NextResponse => {
  return NextResponse.json(
    { access: false, error, nextLessonSlug: null },
    { status }
  );
};

const createSuccessResponse = (
  nextLessonSlug: string | null = null,
  reason?: string
): NextResponse => {
  return NextResponse.json({ access: true, nextLessonSlug, reason });
};

export async function POST(req: NextRequest) {
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

    // Check course access using the refactored function
    const accessResult = await canAccessCourse(userId, course.id);
    // console.log({ accessResult });

    if (!accessResult.access) {
      // Map access denial reasons to appropriate error messages and status codes
      const errorMessages = {
        no_access: {
          message: "You don't have access to this course",
          status: 403,
        },
      };

      const error = errorMessages[
        accessResult.reason as keyof typeof errorMessages
      ] || { message: "Access denied", status: 403 };

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
      { access: false, error: "Internal server error", nextLessonSlug: null },
      { status: 500 }
    );
  }
}
