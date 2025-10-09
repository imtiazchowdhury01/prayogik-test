// api/front/courses/course/route.ts
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// ========== TYPE DEFINITIONS ==========

interface CourseRequest {
  courseSlug: string;
  userId?: string;
}

interface ErrorResponse {
  error: string;
}

// ========== POST HANDLER ==========

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: CourseRequest = await req.json();
    const { courseSlug, userId } = body;

    if (!courseSlug) {
      return NextResponse.json(
        { error: "Invalid Request - courseSlug is required" },
        { status: 400 }
      );
    }

    let studentProfileId: string | null | undefined = undefined;

    if (userId) {
      studentProfileId = await useStudentProfile(userId);
    }

    const course = await db.course.findUnique({
      where: { slug: courseSlug },
      include: {
        purchases: {
          where: {
            paymentStatus: "COMPLETED",
            ...(userId && {
              studentProfile: { userId },
            }),
          },
        },
        lessons: {
          where: { isPublished: true },
          include: {
            Progress: studentProfileId
              ? {
                  where: {
                    studentProfileId,
                  },
                }
              : false,
          },
          orderBy: { position: "asc" },
        },
        prices: true,
        attachments: true,
        teacherProfile: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("[GET_COURSE_DETAILS_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
