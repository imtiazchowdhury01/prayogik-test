// @ts-nocheck
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { value, courseId, userId } = await request.json();

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

  try {
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 }
      );
    }

    const studentProfileId = studentProfile.id;

    const existingRating = await db.rating.findFirst({
      where: { courseId, studentProfileId },
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
          studentProfileId,
        },
      });
      return NextResponse.json(rating, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create or update rating" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const userId = searchParams.get("userId");

  if (!courseId || !userId) {
    return NextResponse.json(
      { message: "Missing courseId or userId" },
      { status: 400 }
    );
  }

  try {
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 }
      );
    }

    const studentProfileId = studentProfile.id;

    const rating = await db.rating.findFirst({
      where: { courseId, studentProfileId },
    });

    if (!rating) {
      return NextResponse.json(null);
    }

    return NextResponse.json(rating);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to get rating" },
      { status: 500 }
    );
  }
}
