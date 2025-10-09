// api/teacher/details/[teacherId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { teacherId: string } }
) {
  const { teacherId } = params;
  const updatedData = await request.json();

  try {
    const existingTeacher = await db.user.findUnique({
      where: { id: teacherId },
      include: {
        teacherProfile: true,
      },
    });

    if (!existingTeacher) {
      return NextResponse.json(
        { message: "Teacher not found." },
        { status: 404 }
      );
    }

    const dataToUpdateOnUserModel: any = {};
    const dataToUpdateOnTeacherProfileModel: any = {};

    for (const key of Object.keys(updatedData)) {
      if (key in existingTeacher) {
        dataToUpdateOnUserModel[key] = updatedData[key];
      }
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
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update teacher.", error: error.message },
      { status: 400 }
    );
  }
}
