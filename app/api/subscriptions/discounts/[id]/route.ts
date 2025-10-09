// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
// DELETE API to remove a specific subscription discount
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Check if subscription discount  exist
    const existingSubscriptionDiscount = await db.subscriptionDiscount.findUnique({
      where: { id },
    });

    if (!existingSubscriptionDiscount) {
      return NextResponse.json(
        { message: "No subscription discount found to delete." },
        { status: 404 }
      );
    }

    // Delete the  settings
    await db.subscriptionDiscount.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "subscription discount deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subscription discount:", error);
    return NextResponse.json(
      { message: error.message || "Error deleting subscription discount" },
      { status: 500 }
    );
  }
}
