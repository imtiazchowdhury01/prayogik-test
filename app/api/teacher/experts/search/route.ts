import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET endpoint to search for verified teachers with published courses
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} - Returns filtered teachers or error response
 * @description
 * - Searches verified teachers by name (case-insensitive)
 * - Only returns teachers with VERIFIED status AND at least one published course
 * - Accepts optional 'search' query parameter
 * - Returns 500 status on server errors
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("search") || "";

  try {
    const teachers = await db.user.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
        teacherProfile: {
          teacherStatus: "VERIFIED", // Only verified teachers
          createdCourses: {
            some: {
              isPublished: true, // Must have at least one published course
            },
          },
        },
      },
      include: {
        teacherProfile: {
          include: {
            teacherRank: true,
            createdCourses: { // Include created courses in response
              where: {
                isPublished: true,
              },
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(teachers);
  } catch (err) {
    console.error("Teacher search failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}