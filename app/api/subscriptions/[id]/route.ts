// api/subscriptions/[id]/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionType } from "@prisma/client";

interface SubscriptionUpdateBody {
  name?: string;
  type?: SubscriptionType;
  regularPrice?: number;
  offerPrice?: number;
  durationInMonths?: number;
  durationInYears?: number;
  isDefault?: boolean;
  isTrial?: boolean;
  trialDurationInDays?: number;
  trialCourseLimit?: number;
  subscriptionDiscountId?: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: SubscriptionUpdateBody = await req.json();

    const session = await getServerUserSession();

    if (!session || !session.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json(
        { message: "Subscription plan ID is required" },
        { status: 400 }
      );
    }

    // Check if subscription plan exists
    const existingPlan = await db.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { message: "Subscription plan not found" },
        { status: 404 }
      );
    }

    // Update subscription plan
    const subscription = await db.subscriptionPlan.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error updating subscription",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const session = await getServerUserSession();

    if (!session || !session.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json(
        { message: "Subscription plan ID is required" },
        { status: 400 }
      );
    }

    // Check if subscription plan exists
    const existingPlan = await db.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { message: "Subscription plan not found" },
        { status: 404 }
      );
    }

    // Delete subscription plan
    const subscription = await db.subscriptionPlan.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Subscription plan deleted successfully", data: subscription },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error deleting subscription",
      },
      { status: 500 }
    );
  }
}
