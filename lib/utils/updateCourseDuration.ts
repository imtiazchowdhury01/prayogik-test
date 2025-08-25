import { db } from "../db";

// Helper function to recalculate course duration
async function updateCourseDuration(courseId: string) {
  const totalDuration = await db.lesson.aggregate({
    where: {
      courseId: courseId,
      isPublished: true, // Only count published lessons
      duration: { not: null },
    },
    _sum: {
      duration: true,
    },
  });
  await db.course.update({
    where: { id: courseId },
    data: { totalDuration: totalDuration._sum.duration || 0 },
  });
}

export default updateCourseDuration;
