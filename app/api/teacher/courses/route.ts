// api/teacher/courses/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { CourseMode } from "@prisma/client";
import { NextResponse } from "next/server";

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

export async function GET(req: Request) {
  const { userId } = await getServerUserSession();

  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized access." },
      { status: 401 }
    );
  }

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
    const url = new URL(req.url);
    let page = parseInt(url.searchParams.get("page") || "1", 10);
    page = isNaN(page) || page < 1 ? 1 : page;

    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
    const title = url.searchParams.get("title") || undefined;
    const category = url.searchParams.get("category") || undefined;

    const skip = (page - 1) * limit;

    const filterConditions = courseFilters({ title, category });

    const courses = await db.course.findMany({
      where: {
        courseMode: CourseMode.RECORDED,
        OR: [
          { teacherProfileId },
          { coTeacherIds: { hasSome: [teacherProfileId] } },
        ],
        ...filterConditions,
      },
      skip,
      take: limit,
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

    const totalCourses = await db.course.count({
      where: {
        courseMode: CourseMode.RECORDED,
        OR: [
          { teacherProfileId },
          { coTeacherIds: { hasSome: [teacherProfileId] } },
        ],
        ...filterConditions,
      },
    });

    const totalPages = Math.ceil(totalCourses / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

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
