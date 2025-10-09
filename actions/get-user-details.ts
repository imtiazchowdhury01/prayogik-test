// @ts-nocheck
"use server";
import { db } from "@/lib/db";

export async function getUserDetails(userId: string) {
  try {
    if (!userId) {
      return { access: false, error: "Unauthorized" };
    }

    // Find the student profile associated with the user
    const userProfile: any = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userProfile) {
      return { access: false, error: "User profile not found" };
    }

    return {
      info: userProfile,
    };
  } catch (error) {
    console.error("Error fetching user details", error);
    return { data: null, error: "Internal Server Error" };
  }
}
