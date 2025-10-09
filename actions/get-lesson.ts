// @ts-nocheck
import { db } from "@/lib/db";
import { Attachment, Lesson } from "@prisma/client";

interface GetLessonProps {
  userId: string;
  courseSlug: string;
  lessonSlug: string;
}

export const getLesson = async ({
  userId,
  courseSlug,
  lessonSlug,
}: GetLessonProps) => {
  try {
    const course = await db.course.findUnique({
      where: {
        slug: courseSlug,
        isPublished: true,
      },
      select: {
        id: true,
        prices: true,
      },
    });

    if (!course) {
      throw new Error("Course not found or not published");
    }

    // const purchase = await db.purchase.findUnique({
    //   where: {
    //     userId_courseId: {
    //       userId,
    //       courseId: course.id,
    //     },
    //   },
    // });

    const purchase = db.enrolledStudents.findFirst({
      where: {
        userId: userId,
        courseId: course.id,
      },
    });

    const lesson = await db.lesson.findUnique({
      where: {
        slug: lessonSlug,
        isPublished: true,
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found or not published");
    }

    let attachments: Attachment[] = [];
    let nextLesson: Lesson | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: course.id,
        },
      });
    }

    if (lesson.isFree || purchase) {
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

    const progress = await db.progress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
    });

    return {
      lesson,
      course,
      attachments,
      nextLesson,
      progress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_LESSON_ERROR]", error);
    return {
      lesson: null,
      course: null,
      attachments: [],
      nextLesson: null,
      progress: null,
      purchase: null,
    };
  }
};
