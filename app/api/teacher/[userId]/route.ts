// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    // Parse the request body
    const { teacherRankId, teacherRank } = await req.json();

    // Ensure that the teacherRankId is provided
    if (!teacherRankId) {
      return NextResponse.json(
        { message: "Teacher Rank ID is required" },
        { status: 400 }
      );
    }

    // Update the teacher's rank in the database
    const result = await db.user.update({
      where: { id: userId }, // Access the teacher by ID
      data: {
        teacherRankId,
        teacherRank,
      },
    });

    // Check if the update was successful
    if (!result) {
      return NextResponse.json(
        { message: "Teacher not found or rank already updated" },
        { status: 404 }
      );
    }

    // revalidatePath("/admin/teachers");

    return NextResponse.json(
      { message: "Teacher rank updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update teacher rank:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// get single teacher details
export async function GET(request, { params }) {
  const { userId } = params;

  try {
  const teacher = await db.user.findFirst({
    where: { id: userId },
    include: {
      teacherProfile: {
        include: {
          teacherRank: true,
        },
      },
    },
  });



    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    return NextResponse.error();
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    // Ensure that the userId is provided
    if (!userId) {
      return NextResponse.json(
        { message: "Teacher ID is required" },
        { status: 400 }
      );
    }

    // Delete the teacher from the database
    const result = await db.user.delete({
      where: { id: userId },
    });

    // Check if the deletion was successful
    if (!result) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }
    // revalidatePath("/admin/teachers");

    return NextResponse.json(
      { message: "Teacher deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete teacher:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

