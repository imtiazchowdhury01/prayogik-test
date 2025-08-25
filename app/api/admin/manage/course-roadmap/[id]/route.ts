import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { z } from "zod";
import { courseRoadmapSchema } from "@/lib/utils/openai/types";

type UpdateCourseRoadmapBody = z.infer<typeof courseRoadmapSchema>;

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    }: UpdateCourseRoadmapBody = await req.json();

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

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (courseLink !== undefined) updateData.courseLink = courseLink;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (category !== undefined) updateData.category = category;
    if (teacherId !== undefined) updateData.teacherId = teacherId;
    if (estimatedDuration !== undefined)
      updateData.estimatedDuration = estimatedDuration;
    if (targetDate !== undefined)
      updateData.targetDate = targetDate ? new Date(targetDate) : null;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (prerequisites !== undefined)
      updateData.prerequisites = prerequisites || null;

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
