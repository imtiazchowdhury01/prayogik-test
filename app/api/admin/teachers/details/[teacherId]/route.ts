// api/admin/teachers/details/[teacherId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function PUT(
  request: Request,
  { params }: { params: { teacherId: string } }
) {
  const { isAdmin } = await getServerUserSession(request);

  const { teacherId } = params;

  const updatedData = await request.json();

  try {
    if (!isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    const existingTeacher = await db.teacherProfile.findUnique({
      where: { userId: teacherId },
    });

    const existingUser = await db.user.findUnique({
      where: { id: existingTeacher?.userId || undefined },
      include: {
        teacherProfile: true,
        studentProfile: {
          include: {
            enrolledCourseIds: true,
          },
        },
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
    const dataToUpdateOnStudentProfileModel: Record<string, any> = {};

    for (const key of Object.keys(updatedData)) {
      if (key in existingUser) {
        dataToUpdateOnUserModel[key] = updatedData[key];
      }

      if (existingUser.teacherProfile && key in existingUser.teacherProfile) {
        dataToUpdateOnTeacherProfileModel[key] = updatedData[key];
      }

      if (existingUser.studentProfile && key in existingUser.studentProfile) {
        dataToUpdateOnStudentProfileModel[key] = updatedData[key];
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

    if (
      existingUser.studentProfile?.id &&
      dataToUpdateOnStudentProfileModel.enrolledCourseIds
    ) {
      const existingEnrollments = await db.enrolledStudents.findMany({
        where: { studentProfileId: existingUser.studentProfile.id },
        select: { courseId: true },
      });

      const existingCourseIds = existingEnrollments
        .map((e) => e.courseId)
        .filter((id): id is string => id !== null);

      const updatedCourseIds =
        (dataToUpdateOnStudentProfileModel.enrolledCourseIds as string[]) || [];

      const newCourseIds = updatedCourseIds.filter(
        (courseId) => !existingCourseIds.includes(courseId)
      );

      const removedCourseIds = existingCourseIds.filter(
        (courseId) => !updatedCourseIds.includes(courseId)
      );

      if (newCourseIds.length > 0) {
        await db.enrolledStudents.createMany({
          data: newCourseIds.map((courseId) => ({
            studentProfileId: existingUser.studentProfile!.id,
            courseId: courseId,
          })),
        });
      }

      if (removedCourseIds.length > 0) {
        await db.enrolledStudents.deleteMany({
          where: {
            studentProfileId: existingUser.studentProfile.id,
            courseId: { in: removedCourseIds },
          },
        });
      }
    }

    const updatedTeacher = await db.user.findUnique({
      where: { id: existingUser.id },
      include: {
        teacherProfile: true,
        studentProfile: true,
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
