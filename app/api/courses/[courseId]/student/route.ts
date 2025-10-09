import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;

  if (!courseId) {
    return NextResponse.json(
      { error: "Valid Course ID is required" },
      { status: 400 }
    );
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { enrolledStudents: true },
    });

    const enrolledStudents = course?.enrolledStudents?.length || 0;

    return NextResponse.json({ enrolledStudents });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
