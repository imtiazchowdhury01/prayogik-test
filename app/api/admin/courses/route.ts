// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

import { isTeacher } from "@/lib/teacher";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    if (!userId && !isAdmin) {
      throw new Error("Unauthorised Access");
    }

    const { title, slug } = await req.json();

    let teacherProfile = await db.teacherProfile.findUnique({
      where: {
        userId: userId, // Getting the teacher profile using userId
      },
    });

    // if not teacher profile create one
    if (!teacherProfile) {
      await db.teacherProfile.create({
        data: {
          userId: userId,
        },
      });

      teacherProfile = await db.teacherProfile.findUnique({
        where: {
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
    return new NextResponse(
      {
        error: true,
        message: error.message,
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

    // Extract and validate query parameters
    const url = new URL(req.url);

    let page = parseInt(url.searchParams.get("page") || "1", 10);
    page = isNaN(page) || page < 1 ? 1 : page;

    let limit = parseInt(url.searchParams.get("limit") || "10", 10);
    limit = isNaN(limit) || limit > 50 ? 10 : limit;

    const title = url.searchParams.get("title") || undefined;
    const category = url.searchParams.get("category") || undefined;
    const sort = url.searchParams.get("sort") === "asc" ? "asc" : "desc";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    const userIds = (await db.user.findMany()).map((user) => user.id);

    // Build filters
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

    // Get paginated courses for admin
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

    // Get total count for pagination metadata
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
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error?.message || "Failed to fetch courses." },
      { status: 500 }
    );
  }
}
