// api/subscriptions/discounts/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// POST API to create subscription discount
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, discountPercentage, isDefault } = body;

    // Validate input
    if (
      !name ||
      typeof discountPercentage !== "number" ||
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    // Create new subscription discount
    const newSubscriptionDiscount = await db.subscriptionDiscount.create({
      data: {
        name,
        discountPercentage,
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json(newSubscriptionDiscount, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription discount:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error creating subscription discount",
      },
      { status: 500 }
    );
  }
}

// GET API to fetch all subscription discounts
export async function GET() {
  try {
    const subscriptionDiscounts = await db.subscriptionDiscount.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(subscriptionDiscounts, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscription discounts:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error fetching subscription discounts",
      },
      { status: 500 }
    );
  }
}

// PUT API to update subscription discount
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, discountPercentage, isDefault } = body;

    // Validate input
    if (
      !id ||
      !name ||
      typeof discountPercentage !== "number" ||
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    // Update the subscription discount
    const updatedSubscriptionDiscount = await db.subscriptionDiscount.update({
      where: { id },
      data: {
        name,
        discountPercentage,
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json(updatedSubscriptionDiscount, { status: 200 });
  } catch (error) {
    console.error("Error updating subscription discount:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error updating subscription discount",
      },
      { status: 500 }
    );
  }
}
