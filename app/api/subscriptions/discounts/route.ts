// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// POST API to create or update subscription discount
export async function POST(req: Request) {
  const { name, discountPercentage, isDefault } = await req.json();

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

  try {
    // Create new subscription discount
    const newSubscriptionDiscount = await db.subscriptionDiscount.create({
      data: {
        name,
        discountPercentage,
        isDefault,
      },
    });

    return NextResponse.json(newSubscriptionDiscount, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating sales", {
      error: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: error.message || "Error managing subscription discount" },
      { status: 500 }
    );
  }
}

// GET API to fetch all subscription discount
export async function GET() {
  try {
    // Fetch all subscription discount from the database
    const subscriptionDiscounts = await db.subscriptionDiscount.findMany();

    // Return settings as JSON response
    return NextResponse.json(subscriptionDiscounts);
  } catch (error) {
    console.error("Error fetching subscription discount:", error);
    return NextResponse.error();
  }
}

export async function PUT(req: Request) {
  const { id, name, discountPercentage, isDefault } = await req.json();

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

  try {
    // Update the subscription discount
    const updatedSubscriptionDiscount = await db.subscriptionDiscount.update({
      where: { id },
      data: {
        name,
        discountPercentage,
        isDefault,
      },
    });

    return NextResponse.json(updatedSubscriptionDiscount, { status: 200 });
  } catch (error) {
    console.error("Error updating subscription discount:", error);
    return NextResponse.json(
      { message: error.message || "Error updating subscription discount" },
      { status: 500 }
    );
  }
}
