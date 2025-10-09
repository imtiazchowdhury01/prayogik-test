// api/courses/[courseId]/student/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
  };
}

interface StudentCountResponse {
  enrolledStudents: number;
}

interface ErrorResponse {
  error: string;
}

// ========== GET HANDLER ==========

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<StudentCountResponse | ErrorResponse>> {
  const { courseId } = params;

  if (!courseId) {
    return NextResponse.json(
      { error: "Valid Course ID is required" },
      { status: 400 }
    );
  }

  try {
    const enrolledCount = await db.enrolledStudents.count({
      where: { courseId },
    });

    return NextResponse.json({ enrolledStudents: enrolledCount });
  } catch (error) {
    console.error("[ENROLLED_STUDENTS_COUNT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
