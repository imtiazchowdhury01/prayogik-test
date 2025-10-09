// @ts-nocheck
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { Attachment, Lesson } from "@prisma/client";

interface GetLessonProps {
  userId: string;
  courseId: string;
  lessonId: string;
}

export const getLesson = async ({
  userId,
  courseId,
  lessonId,
}: GetLessonProps) => {
  try {
    const studentProfileId = await useStudentProfile(userId);

    const purchase = await db.purchase.findFirst({
      where: {
        studentProfileId,
        courseId: courseId,
      },
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        prices: true, // Changed from price to prices (array)
      },
    });

    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
        isPublished: true,
      },
    });

    if (!lesson || !course) {
      throw new Error("Lesson or course not found");
    }

    let attachments: Attachment[] = [];
    let nextLesson: Lesson | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }

    if (lesson.isFree || purchase) {
      nextLesson = await db.lesson.findFirst({
        where: {
          courseId: courseId,
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
        studentProfileId_lessonId: {
          // Changed from userId_chapterId
          studentProfileId,
          lessonId,
        },
      },
    });

    return {
      lesson, // Changed from chapter
      course,
      attachments,
      nextLesson, // Changed from nextChapter
      progress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_LESSON]", error); // Changed from GET_CHAPTER
    return {
      lesson: null, // Changed from chapter
      course: null,
      attachments: [],
      nextLesson: null, // Changed from nextChapter
      progress: null,
      purchase: null,
    };
  }
};
