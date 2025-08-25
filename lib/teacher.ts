// @ts-nocheck

import { db } from "../lib/db";

export const isTeacher = async (userId) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.role === "TEACHER";
};
