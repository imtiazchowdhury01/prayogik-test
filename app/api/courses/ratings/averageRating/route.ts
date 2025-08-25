import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ message: "Missing courseId" }, { status: 400 });
  }

  try {
    const ratings = await db.rating.findMany({
      where: { courseId },
    });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.value, 0) /
          ratings.length
        : 0;

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { enrolledStudents: true },
    });

    const enrolledStudents = course ? course.enrolledStudents.length : 0;

    return NextResponse.json({
      averageRating,
      ratingsCount: ratings.length,
      enrolledStudents,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to get average rating and enrollment info" },
      { status: 500 }
    );
  }
}
