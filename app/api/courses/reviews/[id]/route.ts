

import { db } from "@/lib/db"; 
import { NextResponse } from "next/server";

// Get Review by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const review = await db.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get review" },
      { status: 500 }
    );
  }
}
