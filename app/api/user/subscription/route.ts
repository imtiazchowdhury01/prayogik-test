// @ts-nocheck
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import axios from "axios";
import { getServerUserSession } from "@/lib/getServerUserSession";

// get users purchased subscription
export async function GET(req: Request) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 200 }
      );
    }

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      include: {
        subscription: {
          include: {
            subscriptionPlan: {
              include: {
                subscriptionDiscount: true,
              },
            },
          },
        },
      },
    });

    let subscription = studentProfile?.subscription;

    // Check if the user has any subscriptions
    if (!subscription) {
      return NextResponse.json(
        { message: "No subscriptions found for this user." },
        { status: 200 }
      );
    }

    // Check if the subscription has expired
    const currentDate = new Date();
    const expiresAt = new Date(subscription.expiresAt);

    if (currentDate > expiresAt && subscription.status !== "EXPIRED") {
      // Update the subscription status to "EXPIRED"
      subscription = await db.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
        include: {
          subscriptionPlan: true,
        },
      });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
