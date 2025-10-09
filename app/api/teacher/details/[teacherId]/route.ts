// @ts-nocheck

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Update a specific teacher's details
export async function PUT(
  request: Request,
  { params }: { params: { teacherId: string } }
) {
  const { teacherId } = params;

  // Get the updated data from the request body
  const updatedData = await request.json();

  try {
    // Fetch the existing teacher data
    const existingTeacher = await db.user.findUnique({
      where: { id: teacherId },
      include: {
        teacherProfile: true,
      },
    });

    // If the teacher doesn't exist, return a not found error
    if (!existingTeacher) {
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
      if (key in existingTeacher) {
        dataToUpdateOnUserModel[key] = updatedData[key];
      }
      // Check if key is for TeacherProfile
      if (
        existingTeacher.teacherProfile &&
        key in existingTeacher.teacherProfile
      ) {
        dataToUpdateOnTeacherProfileModel[key] = updatedData[key];
      }
    }

    if (Object.keys(dataToUpdateOnUserModel).length > 0) {
      await db.user.update({
        where: { id: teacherId },
        data: dataToUpdateOnUserModel,
      });
    }

    if (Object.keys(dataToUpdateOnTeacherProfileModel).length > 0) {
      await db.teacherProfile.update({
        where: { userId: teacherId },
        data: dataToUpdateOnTeacherProfileModel,
      });
    }

    const updatedTeacher = await db.user.findUnique({
      where: { id: teacherId },
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
