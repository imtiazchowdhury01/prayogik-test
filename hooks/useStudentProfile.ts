// useTeacherProfile.ts

import { db } from "@/lib/db";

/**
 * Retrieves the teacher profile ID for the given user ID.
 *
 * @param userId - The ID of the user whose teacher profile is to be retrieved.
 * @throws {Error} If the user ID is not provided.
 * @returns {Promise<string | undefined>} The teacher profile ID or undefined if not found.
 */
export const useStudentProfile = async (
  userId: string
): Promise<string | undefined> => {
  // Check if userId is provided
  if (!userId) {
    return;
  }

  // Fetch the teacher profile using the provided userId
  const studentProfile = await db.studentProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  return studentProfile?.id; // Return the teacher profile ID or undefined if not found
};
