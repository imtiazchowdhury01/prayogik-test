// api/admin/manage/course-roadmap/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { CourseRoadmapStatus, DifficultyLevel } from "@prisma/client";

interface UpdateCourseRoadmapBody {
  title?: string;
  description?: string;
  status?: CourseRoadmapStatus;
  category?: string;
  estimatedDuration?: string;
  targetDate?: string;
  difficulty?: DifficultyLevel;
  prerequisites?: string;
  courseLink?: string;
  teacherId?: string;
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as UpdateCourseRoadmapBody;
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

    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { message: "Course roadmap ID is required" },
        { status: 400 }
      );
    }

    const existingRoadmap = await db.courseRoadmap.findUnique({
      where: { id },
    });
    if (!existingRoadmap) {
      return NextResponse.json(
        { message: "Course roadmap not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (category !== undefined) updateData.category = category;
    if (estimatedDuration !== undefined)
      updateData.estimatedDuration = estimatedDuration;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (courseLink !== undefined) updateData.courseLink = courseLink || null;
    if (prerequisites !== undefined)
      updateData.prerequisites = prerequisites || null;
    if (targetDate !== undefined)
      updateData.targetDate = targetDate ? new Date(targetDate) : null;

    if (teacherId !== undefined) {
      updateData.teacher = teacherId
        ? { connect: { id: teacherId } }
        : { disconnect: true };
    }

    const updatedRoadmap = await db.courseRoadmap.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Course roadmap updated successfully",
        data: updatedRoadmap,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course roadmap:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAdmin } = await getServerUserSession(req);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { message: "Course roadmap ID is required" },
        { status: 400 }
      );
    }

    const existingRoadmap = await db.courseRoadmap.findUnique({
      where: { id },
    });
    if (!existingRoadmap) {
      return NextResponse.json(
        { message: "Course roadmap not found" },
        { status: 404 }
      );
    }

    await db.courseRoadmap.delete({ where: { id } });

    return NextResponse.json(
      { message: "Course roadmap deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course roadmap:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
