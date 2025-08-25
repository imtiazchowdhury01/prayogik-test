// @ts-nocheck

import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { compositeSlugify } from "@/lib/slugify";
import { isTeacher } from "@/lib/teacher";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);
    if (!userId || !isTeacher(userId)) {
      throw new Error("Unauthorised Access");
    }
       const teacherProfileId = await useTeacherProfile(userId);

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId,
      },
    });

    if (!courseOwner) {
      throw new Error("Unauthorised Access");
    }

    const lastChapter = await db.lesson.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const { title } = await req.json();
    const slug = await compositeSlugify(
      title,
      db.lesson,
      "slug",
      "courseId",
      courseId
    );

    const chapter = await db.lesson.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
        slug,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
