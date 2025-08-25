// useTeacherProfile.ts

import { db } from "@/lib/db";

/**
 * Retrieves the teacher profile ID for the given user ID.
 *
 * @param userId - The ID of the user whose teacher profile is to be retrieved.
 * @throws {Error} If the user ID is not provided.
 * @returns {Promise<string | undefined>} The teacher profile ID or undefined if not found.
 */
export const useTeacherProfile = async (
  userId: string
): Promise<string | undefined> => {
  // Check if userId is provided
  if (!userId) {
    return;
  }

  // Fetch the teacher profile using the provided userId
  const teacherProfile = await db.teacherProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  return teacherProfile?.id; // Return the teacher profile ID or undefined if not found
};

export const useCoTeacherProfileId = async (
  userId: string,
  courseId: string
) => {
  const teacherProfileId = await useTeacherProfile(userId);

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      coTeachers: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
  if (!course) {
    throw new Error("Course not found");
  }

  return course.coTeachers.find(
    (coTeacher) => coTeacher.id === teacherProfileId
  )?.id;
};

export const useCourseByTeacherOrCoTeacher = async (
  userId: string,
  courseId: string
) => {
  const teacherProfileId = await useTeacherProfile(userId);
  const coTeacherProfileId = await useCoTeacherProfileId(userId, courseId);

  if (!teacherProfileId && !coTeacherProfileId) {
    return null;
  }

  const whereClause: any = {
    id: courseId,
    OR: [],
  };

  if (teacherProfileId) {
    whereClause.OR.push({ teacherProfileId });
  }

  if (coTeacherProfileId) {
    whereClause.OR.push({
      coTeacherIds: {
        hasSome: [coTeacherProfileId],
      },
    });
  }

  const course = await db.course.findUnique({
    where: whereClause,
    include: {
      lessons: true,
      category: true,
      attachments: true,
    },
  });

  return course ?? null;
};
