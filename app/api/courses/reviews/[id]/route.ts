// api/courses/reviews/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

// Get Review by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Review ID is required" },
        { status: 400 }
      );
    }

    const review = await db.review.findUnique({
      where: { id },
      include: {
        studentProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
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

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("[GET_REVIEW_BY_ID_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to get review" },
      { status: 500 }
    );
  }
}
