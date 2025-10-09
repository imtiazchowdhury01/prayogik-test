// api/user/[userId]/chapters/[chapterId]/progress/route.ts
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const studentProfileId = await useStudentProfile(userId);

    if (!studentProfileId) {
      return new NextResponse("Student profile not found", { status: 404 });
    }

    const { isCompleted } = await req.json();

    const progress = await db.progress.upsert({
      where: {
        studentProfileId_lessonId: {
          studentProfileId,
          lessonId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        studentProfileId,
        lessonId: params.chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
