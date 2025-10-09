import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getUserSubscription } from "@/lib/getUserSubscription";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { courseSlug, lessonSlug } = await req.json();
    const studentProfileId = await useStudentProfile(userId);
    const userSubscription = await getUserSubscription();

    const lesson = await db.lesson.findFirst({
      where: {
        slug: lessonSlug,
        isPublished: true,
        course: {
          slug: courseSlug,
          isPublished: true,
        },
      },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        {
          error: "Lesson not found or not published",
        },
        { status: 404 }
      );
    }

    const { course } = lesson;

    if (!course || !course.isPublished) {
      return NextResponse.json(
        {
          error: "Course not found or not published",
        },
        { status: 404 }
      );
    }

    const purchase = await db.enrolledStudents.findFirst({
      where: {
        studentProfileId,
        courseId: course.id,
      },
    });

    let attachments: any[] = [];
    let nextLesson = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: course.id,
        },
      });
    }

    if (
      lesson.isFree ||
      purchase ||
      (userSubscription?.status === "ACTIVE" && course.isUnderSubscription)
    ) {
      nextLesson = await db.lesson.findFirst({
        where: {
          courseId: course.id,
          isPublished: true,
          position: {
            gt: lesson.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const progress = await db.progress.findFirst({
      where: {
        studentProfileId,
        lessonId: lesson.id,
      },
    });

    return NextResponse.json({
      lesson,
      course,
      attachments,
      nextLesson,
      progress,
      purchase,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
