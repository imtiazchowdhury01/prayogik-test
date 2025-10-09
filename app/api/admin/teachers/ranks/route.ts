// api/admin/teachers/ranks/route.ts
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
    console.error("Error fetching teacher ranks", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: errorMessage || "Error fetching teacher ranks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, feePercentage, numberOfSales } = body as {
      name: string;
      description: string;
      feePercentage: number;
      numberOfSales: number;
    };

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
    console.error("Error creating new teacher rank", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: errorMessage || "Error creating new teacher rank" },
      { status: 500 }
    );
  }
}
