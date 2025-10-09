// api/courses/reviews/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface CreateReviewRequest {
  content: string;
  courseId: string;
  userId: string;
}

interface UpdateReviewRequest {
  id: string;
  content: string;
}

interface DeleteReviewRequest {
  id: string;
}

// Create Review
export async function POST(request: Request) {
  try {
    const body: CreateReviewRequest = await request.json();
    const { content, courseId, userId } = body;

    if (!content || !courseId || !userId) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    // Get student profile
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

    const review = await db.review.create({
      data: {
        content,
        courseId,
        studentProfileId: studentProfile.id,
      },
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
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("[CREATE_REVIEW_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}

// Get all Reviews
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    const whereClause = courseId ? { courseId } : {};

    const reviews = await db.review.findMany({
      where: whereClause,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[GET_REVIEWS_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to get reviews" },
      { status: 500 }
    );
  }
}

// Update Review
export async function PUT(request: Request) {
  try {
    const body: UpdateReviewRequest = await request.json();
    const { id, content } = body;

    if (!id || !content) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    const updatedReview = await db.review.update({
      where: { id },
      data: { content },
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
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("[UPDATE_REVIEW_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to update review" },
      { status: 500 }
    );
  }
}

// Delete Review
export async function DELETE(request: Request) {
  try {
    const body: DeleteReviewRequest = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    await db.review.delete({ where: { id } });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("[DELETE_REVIEW_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to delete review" },
      { status: 500 }
    );
  }
}
