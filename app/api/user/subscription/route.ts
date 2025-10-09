// api/user/subscription/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function GET(req: Request) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
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

    if (!subscription) {
      return NextResponse.json(
        { message: "No subscriptions found for this user." },
        { status: 200 }
      );
    }

    const currentDate = new Date();
    const expiresAt = new Date(subscription.expiresAt);

    if (currentDate > expiresAt && subscription.status !== "EXPIRED") {
      subscription = await db.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
        include: {
          subscriptionPlan: {
            include: {
              subscriptionDiscount: true,
            },
          },
        },
      });
    }

    return NextResponse.json(subscription);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
