// @ts-nocheck

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

// Update a specific teacher's details
export async function PUT(
  request: Request,
  { params }: { params: { teacherId: string } }
) {
  const { isAdmin } = await getServerUserSession(request);

  const { teacherId } = params;

  // Get the updated data from the request body
  const updatedData = await request.json();

  try {
    if (!isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    // Fetch the existing teacher data
    const existingTeacher = await db.teacherProfile.findUnique({
      where: { userId: teacherId },
    });

    const existingUser = await db.user.findUnique({
      where: { id: existingTeacher?.userId },
      include: {
        teacherProfile: true,
        studentProfile: {
          include: {
            enrolledCourseIds: true,
          },
        },
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
    const dataToUpdateOnStudentProfileModel = {};

    // Dynamically add fields from updatedData if they exist
    for (const key of Object.keys(updatedData)) {
      if (key in existingUser) {
        dataToUpdateOnUserModel[key] = updatedData[key];
      }
      // Check if key is for TeacherProfile
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

    const existingEnrollments = await db.enrolledStudents.findMany({
      where: { studentProfileId: existingUser.studentProfile?.id },
      select: { courseId: true },
    });

    const existingCourseIds = new Set(
      existingEnrollments.map((e) => e.courseId)
    );

    const updatedCourseIds = new Set(
      dataToUpdateOnStudentProfileModel.enrolledCourseIds || []
    );

    // **Find New Courses to Add**
    const newCourseIds = [...updatedCourseIds].filter(
      (courseId) => !existingCourseIds.has(courseId)
    );

    // **Find Removed Courses to Delete**
    const removedCourseIds = [...existingCourseIds].filter(
      (courseId) => !updatedCourseIds.has(courseId)
    );

    // **Insert New Courses**
    if (newCourseIds.length > 0) {
      await db.enrolledStudents.createMany({
        data: newCourseIds.map((courseId) => ({
          studentProfileId: existingUser.studentProfile?.id,
          courseId: courseId,
        })),
      });
    }

    // **Delete Removed Courses**
    if (removedCourseIds.length > 0) {
      await db.enrolledStudents.deleteMany({
        where: {
          studentProfileId: existingUser.studentProfile?.id,
          courseId: { in: removedCourseIds },
        },
      });
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
    // Return an error response
    return NextResponse.json(
      { message: "Failed to update teacher.", error: error.message },
      { status: 400 }
    );
  }
}
