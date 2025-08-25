export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function GET() {
  try {
    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ message: "User not found!" }, { status: 500 });
    }

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 500 }
      );
    }

    // First get all subscriptions with their student profiles
    const subscriptions = await db.subscription.findMany({
      where: {
        subscriptionPlan: {
          isNot: null, // Only include subscriptions with a plan
        },
      },
      select: {
        id: true,
        expiresAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        subscriptionPlan: {
          select: {
            id: true,
            name: true,
          },
        },
        studentProfile: {
          select: {
            id: true,
            userId: true,
            // enrolledCourseIds: true,
            // purchases: true
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Then fetch user data for each unique userId
    const userIds = subscriptions
      .map((sub) => sub.studentProfile?.userId)
      .filter(Boolean) as string[];

    const users = await db.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
      },
    });

    // Combine the data
    const subscriptionsWithUsers = subscriptions.map((subscription) => {
      const user = subscription.studentProfile?.userId
        ? users.find((u) => u.id === subscription.studentProfile?.userId)
        : null;

      return {
        ...subscription,
        studentProfile: subscription.studentProfile
          ? {
              ...subscription.studentProfile,
              user,
            }
          : null,
      };
    });

    return NextResponse.json(subscriptionsWithUsers);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
