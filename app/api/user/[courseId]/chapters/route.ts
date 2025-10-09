// api/user/[courseId]/chapters/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!teacherProfile) {
      return new NextResponse("Teacher profile not found", { status: 404 });
    }

    const courseOwner = await db.course.findFirst({
      where: {
        id: params.courseId,
        teacherProfileId: teacherProfile.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastLesson = await db.lesson.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    const lesson = await db.lesson.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
