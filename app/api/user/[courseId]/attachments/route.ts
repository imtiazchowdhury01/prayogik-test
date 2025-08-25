import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req); // Get userId from session
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

       const teacherProfileId = await useTeacherProfile(userId);

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId, // Assuming userId corresponds to teacherId in Course model
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("Error creating attachment:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
