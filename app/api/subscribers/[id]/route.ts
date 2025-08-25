import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Subscription ID is required" },
        { status: 400 }
      );
    }

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

    const subscription = await db.subscription.findUnique({
      where: {
        id: id,
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
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    let user = null;
    if (subscription.studentProfile?.userId) {
      user = await db.user.findUnique({
        where: {
          id: subscription.studentProfile.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
        },
      });
    }

    const subscriptionWithUser = {
      ...subscription,
      studentProfile: subscription.studentProfile
        ? {
            ...subscription.studentProfile,
            user,
          }
        : null,
    };

    return NextResponse.json(subscriptionWithUser);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Subscription ID is required" },
        { status: 400 }
      );
    }
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
    // Validate ObjectId format for MongoDB
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { message: "Invalid subscription ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, subscriptionExpiresAt, subscriptionCreatedAt } = body;

    // Validate that subscription exists with more detailed logging
    console.log(`Attempting to find subscription with ID: ${id}`);
    const existingSubscription = await db.subscription.findUnique({
      where: { id },
      include: {
        subscriptionPlan: true,
        studentProfile: true,
      },
    });

    if (!existingSubscription) {
      console.log(`Subscription not found for ID: ${id}`);
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    console.log(`Found subscription:`, existingSubscription);

    // Prepare update data
    const updateData: { [key: string]: any } = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (subscriptionExpiresAt !== undefined) {
      updateData.expiresAt = subscriptionExpiresAt
        ? new Date(subscriptionExpiresAt)
        : null;
    }

    if (subscriptionCreatedAt !== undefined) {
      updateData.createdAt = subscriptionCreatedAt
        ? new Date(subscriptionCreatedAt)
        : null;
    }

    // Always update the updatedAt field
    updateData.updatedAt = new Date();

    console.log(`Update data:`, updateData);

    // Update the subscription with transaction for safety
    const updatedSubscription = await db.$transaction(async (prisma) => {
      // Double-check the record still exists within the transaction
      const stillExists = await prisma.subscription.findUnique({
        where: { id },
      });

      if (!stillExists) {
        throw new Error("Subscription was deleted during update process");
      }

      return await prisma.subscription.update({
        where: { id },
        data: updateData,
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
            },
          },
        },
      });
    });

    // Fetch user data if needed
    let user = null;
    if (updatedSubscription.studentProfile?.userId) {
      user = await db.user.findUnique({
        where: {
          id: updatedSubscription.studentProfile.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
        },
      });
    }

    const subscriptionWithUser = {
      ...updatedSubscription,
      studentProfile: updatedSubscription.studentProfile
        ? {
            ...updatedSubscription.studentProfile,
            user,
          }
        : null,
    };

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription: subscriptionWithUser,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);

    // Handle specific Prisma errors
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Subscription not found or was deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
