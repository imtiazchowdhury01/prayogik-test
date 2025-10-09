import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { courseRoadmapSchema } from "@/lib/utils/openai/types";
import { NextResponse } from "next/server";
import { z } from "zod";

interface GetCourseRoadmapsBody {
  isAdmin: boolean;
}

type CreateCourseRoadmapBody = z.infer<typeof courseRoadmapSchema>;

interface UpdateCourseRoadmapBody {
  isAdmin: boolean;
  id: string;
  title?: string;
  description?: string;
  status?: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  category?: string;
  estimatedDuration?: string;
  targetDate?: Date;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  prerequisites?: string;
  courseLink?: string;
}

interface DeleteCourseRoadmapBody {
  isAdmin: boolean;
  id: string;
}
// GET - Fetch Course Roadmaps
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

// POST - Create Course Roadmap
export async function POST(req: Request) {
  try {
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
    }: CreateCourseRoadmapBody = await req.json();

    const { isAdmin } = await getServerUserSession(req);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Validate required fields
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
        teacherId,
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
