// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { Subscription } from "@prisma/client";

export type UserSubscriptionResponse =
  | (Subscription & {
      subscriptionPlan: {
        subscriptionDiscount: any;
      };
    })
  | null;

export async function getUserSubscription(): Promise<UserSubscriptionResponse> {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return null;
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
      return null;
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

    return subscription;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return null;
  }
}
