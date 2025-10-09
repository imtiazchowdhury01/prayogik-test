// api/admin/teachers/[teacherId]/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { teacherId: string } }
) {
  const { teacherId } = params;

  try {
    const teacher = await db.user.findFirst({
      where: {
        teacherProfile: {
          id: teacherId,
        },
      },
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { teacherId: string } }
) {
  const { teacherId } = params;

  const updatedData = await request.json();

  try {
    const { isAdmin } = await getServerUserSession();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "You are not an admin" },
        { status: 401 }
      );
    }

    const existingUser = await db.user.findFirst({
      where: {
        teacherProfile: {
          id: teacherId,
        },
      },
      include: {
        teacherProfile: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Teacher not found." },
        { status: 404 }
      );
    }

    const dataToUpdateOnUserModel: Record<string, any> = {};
    const dataToUpdateOnTeacherProfileModel: Record<string, any> = {};

    for (const key of Object.keys(updatedData)) {
      if (key in existingUser) {
        dataToUpdateOnUserModel[key] = updatedData[key];
      }

      if (existingUser.teacherProfile && key in existingUser.teacherProfile) {
        dataToUpdateOnTeacherProfileModel[key] = updatedData[key];
      }
    }

    if (Object.keys(dataToUpdateOnUserModel).length > 0) {
      await db.user.update({
        where: { id: existingUser.id },
        data: dataToUpdateOnUserModel,
      });
    }

    if (Object.keys(dataToUpdateOnTeacherProfileModel).length > 0) {
      await db.teacherProfile.update({
        where: { id: teacherId },
        data: dataToUpdateOnTeacherProfileModel,
      });
    }

    const updatedTeacher = await db.user.findUnique({
      where: { id: existingUser.id },
      include: {
        teacherProfile: true,
      },
    });

    return NextResponse.json(updatedTeacher, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update teacher.", error: errorMessage },
      { status: 400 }
    );
  }
}
