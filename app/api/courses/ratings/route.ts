// api/courses/ratings/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface CreateRatingRequest {
  value: number;
  courseId: string;
  userId: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateRatingRequest = await request.json();
    const { value, courseId, userId } = body;

    if (
      typeof value !== "number" ||
      value < 1 ||
      value > 5 ||
      !courseId ||
      !userId
    ) {
      return NextResponse.json(
        { message: "Missing or invalid data" },
        { status: 400 }
      );
    }

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 }
      );
    }

    const existingRating = await db.rating.findFirst({
      where: {
        courseId,
        studentProfileId: studentProfile.id,
      },
    });

    if (existingRating) {
      const updatedRating = await db.rating.update({
        where: { id: existingRating.id },
        data: { value },
      });
      return NextResponse.json(updatedRating, { status: 200 });
    } else {
      const rating = await db.rating.create({
        data: {
          value,
          courseId,
          studentProfileId: studentProfile.id,
        },
      });
      return NextResponse.json(rating, { status: 201 });
    }
  } catch (error) {
    console.error("[CREATE_RATING_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to create or update rating" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId");

    if (!courseId || !userId) {
      return NextResponse.json(
        { message: "Missing courseId or userId" },
        { status: 400 }
      );
    }

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 }
      );
    }

    const rating = await db.rating.findFirst({
      where: {
        courseId,
        studentProfileId: studentProfile.id,
      },
    });

    if (!rating) {
      return NextResponse.json(null);
    }

    return NextResponse.json(rating);
  } catch (error) {
    console.error("[GET_RATING_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to get rating" },
      { status: 500 }
    );
  }
}
