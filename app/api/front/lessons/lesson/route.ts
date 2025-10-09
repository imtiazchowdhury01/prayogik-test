// api/front/lessons/lesson/route.ts
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getUserSubscription } from "@/lib/getUserSubscription";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface LessonRequest {
  courseSlug: string;
  lessonSlug: string;
}

type LessonWithCourse = Prisma.LessonGetPayload<{
  include: {
    course: {
      include: {
        lessons: true;
      };
    };
  };
}>;

type Attachment = Prisma.AttachmentGetPayload<{}>;
type NextLesson = Prisma.LessonGetPayload<{}> | null;
type Progress = Prisma.ProgressGetPayload<{}> | null;
type EnrolledStudent = Prisma.EnrolledStudentsGetPayload<{}> | null;

interface LessonResponse {
  lesson: LessonWithCourse;
  course: LessonWithCourse["course"];
  attachments: Attachment[];
  nextLesson: NextLesson;
  progress: Progress;
  purchase: EnrolledStudent;
}

interface ErrorResponse {
  error: string;
}

// ========== POST HANDLER ==========

export async function POST(
  req: NextRequest
): Promise<NextResponse<LessonResponse | ErrorResponse>> {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: LessonRequest = await req.json();
    const { courseSlug, lessonSlug } = body;

    if (!courseSlug || !lessonSlug) {
      return NextResponse.json(
        { error: "Missing courseSlug or lessonSlug" },
        { status: 400 }
      );
    }

    const studentProfileId = await useStudentProfile(userId);

    if (!studentProfileId) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

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
            lessons: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found or not published" },
        { status: 404 }
      );
    }

    const { course } = lesson;

    if (!course || !course.isPublished) {
      return NextResponse.json(
        { error: "Course not found or not published" },
        { status: 404 }
      );
    }

    const purchase = await db.enrolledStudents.findFirst({
      where: {
        studentProfileId,
        courseId: course.id,
      },
    });

    let attachments: Attachment[] = [];
    let nextLesson: NextLesson = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: course.id,
        },
      });
    }

    const hasAccess =
      lesson.isFree ||
      !!purchase ||
      (userSubscription?.status === "ACTIVE" && course.isUnderSubscription);

    if (hasAccess) {
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
    console.error("[GET_LESSON_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
