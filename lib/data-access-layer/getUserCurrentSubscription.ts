"use server";
import { db } from "../db";

// get the user current subscription by email from db call
export const getUserCurrentSubscriptionDBCall = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
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
        },
      },
    });

    if (!user || !user.studentProfile?.subscription) {
      return null; // No subscription found
    }

    return user.studentProfile.subscription;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    throw new Error("Failed to fetch user subscription");
  }
};
