// app/api/teachers/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // your database instance

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get search query from URL parameters using nextUrl
    const email = req.nextUrl.searchParams.get("email");

    // Validate email parameter
    if (!email) {
      return new NextResponse("Email parameter is required", { status: 400 });
    }

    // Minimum email length to prevent too many results
    if (email.length < 3) {
      return NextResponse.json([]);
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json([]);
    }

    // Search for teachers with matching email
    // Assuming you have a User model with role field or TeacherProfile model
    const teachers = await db.user.findMany({
      where: {
        email: {
          equals: email,
          mode: "insensitive", // Case-insensitive search
        },
        // Add conditions to filter only teachers
        OR: [
          {
            teacherProfile: {
              isNot: null, // User has a teacher profile
            },
          },
          {
            role: "TEACHER", // Or if you have a role field
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        teacherProfile: {
          select: {
            id: true,
          },
        },
      },
      take: 10, // Limit results to prevent performance issues
      orderBy: {
        email: "asc",
      },
    });

    // Format the response
    const formattedTeachers = teachers.map((teacher) => ({
      id: teacher.teacherProfile?.id || teacher.id, // Use teacher profile ID if available
      name: teacher.name || teacher.email.split("@")[0], // Fallback to email username if no name
      email: teacher.email,
    }));

    return NextResponse.json(formattedTeachers);
  } catch (error) {
    console.error("[TEACHERS_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
