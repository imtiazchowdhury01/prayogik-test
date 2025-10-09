// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
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
    return NextResponse.error();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { teacherId: string } }
) {
  const { teacherId } = params;

  // Get the updated data from the request body
  const updatedData = await request.json();

  try {
    const { isAdmin } = await getServerUserSession();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "You are not an admin" },
        { status: 401 }
      );
    }

    // Fetch the existing teacher data
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

    // If the teacher doesn't exist, return a not found error
    if (!existingUser) {
      return NextResponse.json(
        { message: "Teacher not found." },
        { status: 404 }
      );
    }

    // Create a new data object with only the fields that need to be updated
    const dataToUpdateOnUserModel = {};
    const dataToUpdateOnTeacherProfileModel = {};

    // Dynamically add fields from updatedData if they exist
    for (const key of Object.keys(updatedData)) {
      if (key in existingUser) {
        dataToUpdateOnUserModel[key] = updatedData[key];
      }
      // Check if key is for TeacherProfile
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
    // Return an error response
    return NextResponse.json(
      { message: "Failed to update teacher.", error: error.message },
      { status: 400 }
    );
  }
}
