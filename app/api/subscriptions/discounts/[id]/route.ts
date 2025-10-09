// api/subscriptions/discounts/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE API to remove a specific subscription discount
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Subscription discount ID is required" },
        { status: 400 }
      );
    }

    // Check if subscription discount exists
    const existingSubscriptionDiscount =
      await db.subscriptionDiscount.findUnique({
        where: { id },
      });

    if (!existingSubscriptionDiscount) {
      return NextResponse.json(
        { message: "No subscription discount found to delete." },
        { status: 404 }
      );
    }

    // Delete the subscription discount
    await db.subscriptionDiscount.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Subscription discount deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subscription discount:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error deleting subscription discount",
      },
      { status: 500 }
    );
  }
}
