import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to fetch all users with an active teacher profile.
 * Returns selected user and teacher profile information.
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response with teacher data or error
 */
export async function GET(request: Request) {
  try {
    // Query users who have a valid teacher profile (excluding "NONE" status)
    const teachers = await db.user.findMany({
      where: {
        teacherProfile: {
          teacherStatus: { not: "NONE" },
        },
      },
      select: {
        name: true,
        email: true,
        emailVerified: true,
        teacherProfile: {
          select: {
            id: true,
            teacherStatus: true,
            teacherRank: true,
          },
        },
      },
    });

    // Return 404 if no teachers are found
    if (!teachers.length) {
      return NextResponse.json(
        { error: "Teachers not found" },
        { status: 404 }
      );
    }

    // Return the list of teachers
    return NextResponse.json(teachers);
  } catch (error) {
    // Log and return 500 error for unexpected issues
    console.error("Error fetching teachers", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch teachers." },
      { status: 500 }
    );
  }
}

