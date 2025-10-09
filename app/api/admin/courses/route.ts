// api/admin/courses/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

interface CreateCourseBody {
  title: string;
  slug: string;
}

export async function POST(req: Request) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    if (!userId && !isAdmin) {
      throw new Error("Unauthorised Access");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const body = (await req.json()) as CreateCourseBody;
    const { title, slug } = body;

    let teacherProfile = await db.teacherProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!teacherProfile) {
      teacherProfile = await db.teacherProfile.create({
        data: {
          userId: userId,
        },
      });
    }

    const course = await db.course.create({
      data: {
        teacherProfileId: teacherProfile.id,
        title,
        slug,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: true,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { isAdmin } = await getServerUserSession(req);
    if (!isAdmin) {
      throw new Error("Unauthorised Access");
    }

    const url = new URL(req.url);

    let page = parseInt(url.searchParams.get("page") || "1", 10);
    page = isNaN(page) || page < 1 ? 1 : page;

    let limit = parseInt(url.searchParams.get("limit") || "10", 10);
    limit = isNaN(limit) || limit > 50 ? 10 : limit;

    const title = url.searchParams.get("title") || undefined;
    const category = url.searchParams.get("category") || undefined;
    const sort = url.searchParams.get("sort") === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    const userIds = (await db.user.findMany()).map((user) => user.id);

    const filters: any = {
      teacherProfile: {
        userId: {
          in: userIds,
        },
      },
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

    const courses = await db.course.findMany({
      where: filters,
      orderBy: {
        updatedAt: sort,
      },
      include: {
        prices: true,
        category: true,
        enrolledStudents: true,
        teacherProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
    });

    const totalCourses = await db.course.count({
      where: filters,
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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch courses.";
    return NextResponse.json(
      { error: true, message: errorMessage },
      { status: 500 }
    );
  }
}
