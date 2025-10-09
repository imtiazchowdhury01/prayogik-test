// api/admin/teachers/ranks/[rankId]/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { rankId: string } }
) {
  try {
    const { rankId } = params;

    if (!rankId) {
      return NextResponse.json(
        { message: "Rank ID is required" },
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

    await db.teacherRank.delete({
      where: { id: rankId },
    });

    return NextResponse.json(
      { message: "Rank deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting rank:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: errorMessage || "Error deleting rank" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { rankId: string } }
) {
  const { rankId } = params;
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
      !feePercentage ||
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

    const updatedRank = await db.teacherRank.update({
      where: { id: rankId },
      data: { name, description, feePercentage, numberOfSales },
    });

    return NextResponse.json(updatedRank, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating rank:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: errorMessage || "Error updating rank" },
      { status: 500 }
    );
  }
}
