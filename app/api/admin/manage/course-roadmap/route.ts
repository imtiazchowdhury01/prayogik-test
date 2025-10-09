// api/admin/manage/course-roadmap/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";
import { CourseRoadmapStatus, DifficultyLevel } from "@prisma/client";

interface CreateCourseRoadmapBody {
  title: string;
  description: string;
  status: CourseRoadmapStatus;
  category: string;
  estimatedDuration: string;
  targetDate?: string;
  difficulty: DifficultyLevel;
  prerequisites?: string;
  courseLink?: string;
  teacherId?: string;
}

export async function GET(req: Request) {
  try {
    const courseRoadmaps = await db.courseRoadmap.findMany({
      include: {
        teacher: {
          select: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return NextResponse.json(
      { msg: "Course roadmaps fetched successfully", data: courseRoadmaps },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching course roadmaps:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateCourseRoadmapBody;
    const {
      title,
      description,
      status,
      category,
      estimatedDuration,
      targetDate,
      difficulty,
      prerequisites,
      courseLink,
      teacherId,
    } = body;

    const { isAdmin } = await getServerUserSession(req);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    if (
      !title ||
      !description ||
      !status ||
      !category ||
      !estimatedDuration ||
      !difficulty
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const courseRoadmap = await db.courseRoadmap.create({
      data: {
        title,
        description,
        status,
        category,
        estimatedDuration,
        targetDate: targetDate ? new Date(targetDate) : null,
        difficulty,
        prerequisites: prerequisites || null,
        courseLink: courseLink || null,
        teacherId: teacherId || null,
      },
    });

    return NextResponse.json(
      {
        message: "Course roadmap created successfully",
        data: courseRoadmap,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course roadmap:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
