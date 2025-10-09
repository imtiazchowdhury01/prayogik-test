// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { isAdmin } = await getServerUserSession();
    if (!isAdmin) {
      return NextResponse.json(
        { message: "You are not authorized to perform this action" },
        { status: 401 }
      );
    }

    const ranks = await db.teacherRank.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return NextResponse.json(ranks, { status: 200 });
  } catch (error) {
    console.error("Error fetching teacher ranks", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: error.message || "Error fetching teacher ranks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { name, description, feePercentage, numberOfSales } = await req.json();

  // Validate input
  if (
    !name ||
    typeof feePercentage !== "number" ||
    feePercentage < 0 ||
    feePercentage > 100 ||
    numberOfSales < 0
  ) {
    return NextResponse.json(
      { message: "Invalid input data" },
      { status: 400 }
    );
  }

  const { isAdmin } = await getServerUserSession();
  if (!isAdmin) {
    return NextResponse.json(
      { message: "You are not authorized to perform this action" },
      { status: 401 }
    );
  }

  try {
    // Check if teacher rank already exists
    const existingRank = await db.teacherRank.findUnique({
      where: {
        name,
      },
    });

    if (existingRank) {
      return NextResponse.json(
        { message: "Teacher rank already exists" },
        { status: 400 }
      );
    }

    const newRank = await db.teacherRank.create({
      data: {
        name,
        description,
        feePercentage,
        numberOfSales,
      },
    });
    return NextResponse.json(newRank, { status: 201 });
  } catch (error) {
    console.error("Error creating new teacher rank", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: error.message || "Error creating new teacher rank" },
      { status: 500 }
    );
  }
}
