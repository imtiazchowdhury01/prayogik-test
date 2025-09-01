import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { CourseMode } from "@prisma/client";
import { NextResponse } from "next/server";

// Course filter utility function
const courseFilters = ({
  title,
  category,
}: {
  title?: string;
  category?: string;
}) => {
  const filters: any = {
    isPublished: true,
  };

  if (title) {
    filters.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (category) {
    filters.category = {
      slug: category,
    };
  }

  return filters;
};

/**
 * GET handler to fetch paginated and filtered courses for an authenticated teacher.
 *
 * @param req - The incoming HTTP request
 * @returns JSON response containing a list of courses and pagination metadata,
 *          or an error message with appropriate HTTP status codes
 */
export async function GET(req: Request) {
  // Get the authenticated user session
  const { userId } = await getServerUserSession();

  // Reject request if user is not authenticated
  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Retrieve the teacher profile associated with the authenticated user
  const teacherProfile = await db.teacherProfile.findUnique({
    where: { userId },
  });
  const teacherProfileId = teacherProfile?.id;

  // Reject request if teacher profile is not found
  if (!teacherProfileId) {
    return NextResponse.json(
      { error: true, message: "Teacher profile not found." },
      { status: 404 }
    );
  }

  try {
    // Extract query parameters for pagination and filtering
    const url = new URL(req.url);
    let page = parseInt(url.searchParams.get("page") || "1", 10);
    page = isNaN(page) || page < 1 ? 1 : page;

    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
    const title = url.searchParams.get("title") || undefined;
    const category = url.searchParams.get("category") || undefined;

    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    // Build filter object for courses
    const baseFilters: any = {
      teacherProfile: { userId },
    };
    const filters = {
      ...baseFilters,
      ...courseFilters({ title, category }),
    };

    // Fetch courses where user is teacher or co-teacher
    const courses = await db.course.findMany({
      where: {
        courseMode: CourseMode.RECORDED,
        OR: [
          { teacherProfileId },
          { coTeacherIds: { hasSome: [teacherProfileId] } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        prices: true,
        category: true,
        enrolledStudents: true,
        teacherProfile: {
          select: {
            user: { select: { name: true } },
          },
        },
      },
    });

    // Count total courses matching filters (used for pagination)
    const totalCourses = await db.course.count({ where: filters });

    // Compute pagination metadata
    const totalPages = Math.ceil(totalCourses / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Return course data with pagination info
    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        totalCourses,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}
