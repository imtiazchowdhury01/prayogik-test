// api/courses/ratings/averageRating/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { message: "Missing courseId" },
        { status: 400 }
      );
    }

    const ratings = await db.rating.findMany({
      where: { courseId },
      select: { value: true },
    });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.value, 0) /
          ratings.length
        : 0;

    const enrolledStudentsCount = await db.enrolledStudents.count({
      where: { courseId },
    });

    return NextResponse.json({
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingsCount: ratings.length,
      enrolledStudents: enrolledStudentsCount,
    });
  } catch (error) {
    console.error("[GET_AVERAGE_RATING_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to get average rating and enrollment info" },
      { status: 500 }
    );
  }
}
