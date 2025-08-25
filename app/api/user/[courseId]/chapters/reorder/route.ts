// @ts-nocheck 
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get user session to check if the user is authorized
    const { userId } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
       const teacherProfileId = await useTeacherProfile(userId);

    // Parse the incoming request JSON to extract the list of chapter positions
    const { list } = await req.json();

    // Check if the course belongs to the logged-in teacher (i.e., the userId should match the course's teacherId)
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Iterate through the list of chapters and update their positions
    for (const item of list) {
      await db.lesson.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
