// api/courses/ratings/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Rating ID is required" },
        { status: 400 }
      );
    }

    const rating = await db.rating.findUnique({
      where: { id },
      include: {
        studentProfile: {
          include: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!rating) {
      return NextResponse.json(
        { message: "Rating not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rating);
  } catch (error) {
    console.error("[GET_RATING_BY_ID_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to get rating" },
      { status: 500 }
    );
  }
}
