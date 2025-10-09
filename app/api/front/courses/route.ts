// api/front/courses/route.ts
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface CoursesRequest {
  userId?: string;
}

type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    category: true;
    lessons: true;
    teacherProfile: {
      select: {
        user: {
          select: {
            name: true;
            email: true;
          };
        };
      };
    };
    prices: true;
    rating: true;
    review: true;
    purchases: {
      include: {
        studentProfile: {
          select: {
            userId: true;
          };
        };
      };
    };
  };
}>;

interface CourseWithProgress extends Omit<CourseWithRelations, "purchases"> {
  progress: number | null;
  purchases: CourseWithRelations["purchases"];
}

interface ErrorResponse {
  error: string;
}

// ========== POST HANDLER ==========

export async function POST(
  req: NextRequest
): Promise<NextResponse<CourseWithProgress[] | ErrorResponse>> {
  try {
    const body: CoursesRequest = await req.json();
    const { userId } = body;

    const courses = await db.course.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        lessons: {
          where: { isPublished: true },
          orderBy: { position: "asc" },
        },
        teacherProfile: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        prices: true,
        rating: true,
        review: true,
        purchases: {
          where: {
            paymentStatus: "COMPLETED",
          },
          include: {
            studentProfile: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        let progressPercentage: number | null = null;

        // Filter purchases by userId if provided
        const relevantPurchases = userId
          ? course.purchases.filter((p) => p.studentProfile.userId === userId)
          : course.purchases;

        if (userId && relevantPurchases.length > 0) {
          progressPercentage = await getProgress(userId, course.id);
        }

        return {
          ...course,
          progress: progressPercentage,
          purchases: relevantPurchases,
        };
      })
    );

    return NextResponse.json(coursesWithProgress, { status: 200 });
  } catch (error) {
    console.error("[GET_COURSES_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}
