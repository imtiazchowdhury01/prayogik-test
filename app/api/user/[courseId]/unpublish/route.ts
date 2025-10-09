// @ts-nocheck
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);
       const teacherProfileId = await useTeacherProfile(userId);

    // Check if userId is available
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the course belonging to the user (teacher)
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId, // Ensure the user (teacher) owns the course
      },
    });

    // If the course is not found, return 404
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the course to unpublish it
    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        teacherProfileId, // Ensure the user (teacher) owns the course
      },
      data: {
        isPublished: false, // Unpublish the course
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.error("[COURSE_ID_UNPUBLISH]", error); // Use console.error for errors
    return new NextResponse("Internal Error", { status: 500 });
  }
}
