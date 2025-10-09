// api/subscribers/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function GET() {
  try {
    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ message: "User not found!" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 403 }
      );
    }

    // Fetch subscriptions with their related data
    const subscriptions = await db.subscription.findMany({
      where: {
        subscriptionPlanId: {
          not: null, // Only include subscriptions with a plan
        },
      },
      select: {
        id: true,
        expiresAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        isTrial: true,
        trialStartedAt: true,
        trialEndsAt: true,
        subscriptionPlan: {
          select: {
            id: true,
            name: true,
            type: true,
            regularPrice: true,
            offerPrice: true,
            durationInMonths: true,
            isTrial: true,
          },
        },
        studentProfile: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                role: true,
                currentPlan: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to flatten the user information
    const subscriptionsWithUsers = subscriptions.map((subscription) => ({
      id: subscription.id,
      expiresAt: subscription.expiresAt,
      status: subscription.status,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      isTrial: subscription.isTrial,
      trialStartedAt: subscription.trialStartedAt,
      trialEndsAt: subscription.trialEndsAt,
      subscriptionPlan: subscription.subscriptionPlan,
      studentProfile: subscription.studentProfile
        ? {
            id: subscription.studentProfile.id,
            userId: subscription.studentProfile.userId,
            user: subscription.studentProfile.user,
          }
        : null,
    }));

    return NextResponse.json(subscriptionsWithUsers);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
