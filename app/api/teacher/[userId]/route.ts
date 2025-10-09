// api/teacher/[userId]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const { teacherRankId } = await req.json();

    if (!teacherRankId) {
      return NextResponse.json(
        { message: "Teacher Rank ID is required" },
        { status: 400 }
      );
    }

    const result = await db.teacherProfile.update({
      where: { userId },
      data: {
        teacherRankId,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Teacher not found or rank already updated" },
        { status: 404 }
      );
    }

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

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
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
    return NextResponse.json(
      { error: "Failed to fetch teacher" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    if (!userId) {
      return NextResponse.json(
        { message: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const result = await db.user.delete({
      where: { id: userId },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

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
