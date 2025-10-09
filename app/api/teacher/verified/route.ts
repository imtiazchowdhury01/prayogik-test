export const dynamic = "force-dynamic"; // Force dynamic behavior
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET endpoint to fetch verified teachers with published courses
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} - Returns a list of teachers or an error response
 * @description
 * - Fetches verified teachers who have at least one published course
 * - Accepts optional `limit` query parameter (default: 8)
 * - Returns 500 status on server errors
 */

export async function GET(request: Request) {
  try {
    const teachers = await db.user.findMany({
      where: {
        teacherProfile: {
          teacherStatus: "VERIFIED",
          createdCourses: {
            some: {
              isPublished: true,
            },
          },
        },
      },
      include: {
        teacherProfile: {
          include: {
            teacherRank: true,
            // createdCourses: true,
          },
        },
      },
    });

    return NextResponse.json(teachers);
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
