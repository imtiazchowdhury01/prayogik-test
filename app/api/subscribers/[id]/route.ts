// api/subscribers/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { SubscriptionStatus } from "@prisma/client";

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
      return NextResponse.json({ message: "User not found!" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 403 }
      );
    }

    // Validate ObjectId format for MongoDB
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { message: "Invalid subscription ID format" },
        { status: 400 }
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
            durationInYears: true,
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
    });

    if (!subscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
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
      return NextResponse.json({ message: "User not found!" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 403 }
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
    const { status, expiresAt, isTrial, trialStartedAt, trialEndsAt } = body;

    // Validate that subscription exists
    const existingSubscription = await db.subscription.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        subscriptionPlanId: true,
      },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    // Prepare type-safe update data
    interface SubscriptionUpdateData {
      status?: SubscriptionStatus;
      expiresAt?: Date;
      isTrial?: boolean;
      trialStartedAt?: Date | null;
      trialEndsAt?: Date | null;
      updatedAt: Date;
    }

    const updateData: SubscriptionUpdateData = {
      updatedAt: new Date(),
    };

    // Validate and add status if provided
    if (status !== undefined) {
      const validStatuses: SubscriptionStatus[] = [
        "ACTIVE",
        "INACTIVE",
        "EXPIRED",
        "CANCELLED",
        "PENDING",
      ];

      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            message: `Invalid status. Must be one of: ${validStatuses.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      updateData.status = status;
    }

    // Add expiresAt if provided
    if (expiresAt !== undefined) {
      const expiresAtDate = new Date(expiresAt);
      if (isNaN(expiresAtDate.getTime())) {
        return NextResponse.json(
          { message: "Invalid expiresAt date format" },
          { status: 400 }
        );
      }
      updateData.expiresAt = expiresAtDate;
    }

    // Add trial fields if provided
    if (isTrial !== undefined) {
      updateData.isTrial = isTrial;
    }

    if (trialStartedAt !== undefined) {
      if (trialStartedAt === null) {
        updateData.trialStartedAt = null;
      } else {
        const trialStartDate = new Date(trialStartedAt);
        if (isNaN(trialStartDate.getTime())) {
          return NextResponse.json(
            { message: "Invalid trialStartedAt date format" },
            { status: 400 }
          );
        }
        updateData.trialStartedAt = trialStartDate;
      }
    }

    if (trialEndsAt !== undefined) {
      if (trialEndsAt === null) {
        updateData.trialEndsAt = null;
      } else {
        const trialEndDate = new Date(trialEndsAt);
        if (isNaN(trialEndDate.getTime())) {
          return NextResponse.json(
            { message: "Invalid trialEndsAt date format" },
            { status: 400 }
          );
        }
        updateData.trialEndsAt = trialEndDate;
      }
    }

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
              durationInYears: true,
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
      });
    });

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription,
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
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
