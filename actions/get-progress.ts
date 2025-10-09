// actions/get-progress.ts
"use server";

import { db } from "@/lib/db";

export const getProgress = async (
  userId: string | null,
  courseId: string
): Promise<number> => {
  try {
    // Return 0 if no user is logged in
    if (!userId) {
      return 0;
    }

    // Get the student profile for the user
    const studentProfile = await db.studentProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    // Return 0 if student profile doesn't exist
    if (!studentProfile) {
      return 0;
    }

    // Get all published lessons for the course
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

    // Return 0 if there are no published lessons
    if (publishedLessonIds.length === 0) {
      return 0;
    }

    // Count completed lessons
    const validCompletedLessons = await db.progress.count({
      where: {
        studentProfileId: studentProfile.id,
        lessonId: {
          in: publishedLessonIds,
        },
        isCompleted: true,
      },
    });

    // Calculate progress percentage
    const progressPercentage =
      (validCompletedLessons / publishedLessonIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.error("[GET_PROGRESS]", error);
    return 0;
  }
};
