import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

/**
 * GET handler to fetch a lesson by lessonId and courseId for an authenticated user.
 *
 * @param {Request} req - Incoming HTTP request.
 * @param {{ params: { lessonId: string; courseId: string } }} context - Route parameters.
 * @returns {Promise<NextResponse>} JSON response with lesson data or an error message.
 */
export async function GET(
  req: Request,
  { params }: { params: { lessonId: string; courseId: string } }
) {
  // Get the current user session to verify authentication
  const { userId } = await getServerUserSession();
  const { lessonId, courseId } = params;

  // If no user session is found, return an unauthorized response
  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    // Attempt to find the lesson based on provided lessonId and courseId
    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
        courseId: courseId,
      },
    });

    // Return the lesson data (can be null if not found)
    return NextResponse.json(lesson);
  } catch (error) {
    // Log and return a 500 error response in case of failure
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch lesson." },
      { status: 500 }
    );
  }
}


