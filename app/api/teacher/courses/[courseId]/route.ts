import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

/**
 * GET handler to fetch detailed course information for an authorized teacher.
 *
 * @param req - Incoming request object
 * @param params - Route parameters containing courseId
 * @returns JSON response with course data or error message
 */
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  // Get the logged-in user's ID from session
  const { userId } = await getServerUserSession();
  const { courseId } = params;

  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Fetch the teacher profile associated with the current user
  const teacherProfile = await db.teacherProfile.findUnique({
    where: { userId },
  });

  const teacherProfileId = teacherProfile?.id;

  if (!teacherProfileId) {
    return NextResponse.json(
      { error: true, message: "Teacher profile not found." },
      { status: 404 }
    );
  }

  try {
    // Fetch course details if the user is the main teacher or a co-teacher
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        OR: [
          { teacherProfileId }, // main teacher
          {
            coTeacherIds: {
              hasSome: [teacherProfileId], // co-teacher
            },
          },
        ],
      },
      include: {
        prices: true,
        lessons: { orderBy: { position: "asc" } },
        attachments: { orderBy: { createdAt: "desc" } },
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
        teacherProfile: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch course." },
      { status: 500 }
    );
  }
}

