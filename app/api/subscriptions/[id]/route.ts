// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params; // Extracting the subscription ID from the request parameters
  const body = await req.json(); // Extracting the request body

  try {
    const session = await getServerUserSession();

    if (!session && !session.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const trialPlan = await db.subscriptionPlan.findFirst({
      where: {
        isTrial: true,
      },
    });
    if (body.isTrial && trialPlan) {
      // Trial subscription plan exists
      return NextResponse.json(
        {
          message: "A trial subscription plan is already available.",
        },
        { status: 409 }
      );
    }
    const subscription = await db.subscriptionPlan.update({
      where: { id: id },
      data: {
        ...body, // Spread the body to update the subscription with the provided data
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
