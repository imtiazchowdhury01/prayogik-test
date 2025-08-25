import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";
import { parse } from "url";

// DELETE API to remove a rank by ID
export async function DELETE(
  req: Request,
  { params }: { params: { rankId: string } }
) {
  try {
    // Extract rankId from request URL
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
      where: { id: rankId as string },
    });

    return NextResponse.json(
      { message: "Rank deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting rank:", error);
    return NextResponse.json(
      { message: error.message || "Error deleting rank" },
      { status: 500 }
    );
  }
}

// PUT API to update an existing rank
export async function PUT(
  req: Request,
  { params }: { params: { rankId: string } }
) {
  const { rankId } = params;
  try {
    const { name, description, feePercentage, numberOfSales } =
      await req.json();

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
  } catch (error: any) {
    console.error("Error updating rank:", error);
    return NextResponse.json(
      { message: error.message || "Error updating rank" },
      { status: 500 }
    );
  }
}
