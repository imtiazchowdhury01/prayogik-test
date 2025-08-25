// @ts-nocheck
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";

export const getProgress = async (
  userId: string | null,
  courseId: string
): Promise<number> => {
  try {
    const studentProfileId = await useStudentProfile(userId);

    const publishedLessons = await db.lesson.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedLessonIds = publishedLessons.map((lesson) => lesson.id);

    const validCompletedLessons = await db.progress.count({
      where: {
        studentProfileId: studentProfileId || "",
        lessonId: {
          in: publishedLessonIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      publishedLessonIds.length > 0
        ? (validCompletedLessons / publishedLessonIds.length) * 100
        : 0;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
