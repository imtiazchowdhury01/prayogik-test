// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params; // Extracting the subscription ID from the request parameters
  const { name, type, regularPrice, subscriptionDiscountId } = await req.json(); // Extracting the request body

  try {
    const session = await getServerUserSession();

    if (!session && !session.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const subscription = await db.subscriptionPlan.update({
      where: { id: id },
      data: {
        name,
        type,
        regularPrice,
        subscriptionDiscountId,
      },
    });

    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { message: "Error updating subscription", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const session = await getServerUserSession();

    if (!session && !session.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const subscription = await db.subscriptionPlan.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting subscription", error },
      { status: 500 }
    );
  }
}
