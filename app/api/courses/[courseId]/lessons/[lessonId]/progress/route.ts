// api/courses/[courseId]/lessons/[lessonId]/progress/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    courseId: string;
    lessonId: string;
  };
}

interface ProgressRequest {
  isCompleted: boolean;
}

export async function PUT(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { lessonId } = params;

    if (!lessonId) {
      return new NextResponse("Missing lessonId", { status: 400 });
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        studentProfile: {
          select: { id: true },
        },
      },
    });

    const studentProfileId = user?.studentProfile?.id;

    if (!studentProfileId) {
      return new NextResponse("Student profile not found", { status: 400 });
    }

    const body: ProgressRequest = await req.json();
    const { isCompleted } = body;

    const progress = await db.progress.upsert({
      where: {
        studentProfileId_lessonId: {
          studentProfileId,
          lessonId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        studentProfileId,
        lessonId,
        isCompleted,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[LESSON_PROGRESS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
