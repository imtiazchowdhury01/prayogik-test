// api/subscriptions/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";
import { SubscriptionType, Frequency } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerUserSession();

    if (!session.userId || !session.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { message: "Subscription plan name is required" },
        { status: 400 }
      );
    }

    if (!body.subscriptionDiscountId) {
      return NextResponse.json(
        { message: "Subscription discount ID is required" },
        { status: 400 }
      );
    }

    // Validate subscription discount exists
    const discountExists = await db.subscriptionDiscount.findUnique({
      where: { id: body.subscriptionDiscountId },
    });

    if (!discountExists) {
      return NextResponse.json(
        { message: "Invalid subscription discount ID" },
        { status: 400 }
      );
    }

    // Check if trial plan already exists if this is a trial plan
    if (body.isTrial) {
      const existingTrialPlan = await db.subscriptionPlan.findFirst({
        where: {
          isTrial: true,
        },
      });

      if (existingTrialPlan) {
        return NextResponse.json(
          {
            message: "A trial subscription plan already exists",
            existingPlan: {
              id: existingTrialPlan.id,
              name: existingTrialPlan.name,
            },
          },
          { status: 409 }
        );
      }
    }

    // Validate subscription type if provided
    if (body.type) {
      const validTypes: SubscriptionType[] = ["NONE", "MONTHLY", "YEARLY"];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          {
            message: `Invalid subscription type. Must be one of: ${validTypes.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }
    }

    // Prepare subscription plan data
    interface SubscriptionPlanData {
      name: string;
      type?: SubscriptionType | null;
      regularPrice?: number | null;
      offerPrice?: number | null;
      durationInMonths?: number;
      durationInYears?: number;
      isDefault?: boolean;
      isTrial?: boolean;
      trialDurationInDays?: number | null;
      trialCourseLimit?: number;
      subscriptionDiscountId: string;
    }

    const subscriptionData: SubscriptionPlanData = {
      name: body.name,
      subscriptionDiscountId: body.subscriptionDiscountId,
      isDefault: body.isDefault ?? false,
      isTrial: body.isTrial ?? false,
      trialCourseLimit: body.trialCourseLimit ?? 5,
    };

    // Add optional fields if provided
    if (body.type !== undefined) {
      subscriptionData.type = body.type;
    }

    if (body.regularPrice !== undefined) {
      subscriptionData.regularPrice = parseFloat(body.regularPrice);
    }

    if (body.offerPrice !== undefined) {
      subscriptionData.offerPrice = parseFloat(body.offerPrice);
    }

    if (body.durationInMonths !== undefined) {
      subscriptionData.durationInMonths = parseInt(body.durationInMonths) || 1;
    }

    if (body.durationInYears !== undefined) {
      subscriptionData.durationInYears = parseInt(body.durationInYears) || 1;
    }

    if (body.trialDurationInDays !== undefined) {
      subscriptionData.trialDurationInDays =
        parseInt(body.trialDurationInDays) || 30;
    }

    // Create subscription plan
    const subscriptionPlan = await db.subscriptionPlan.create({
      data: subscriptionData,
      include: {
        subscriptionDiscount: true,
      },
    });

    return NextResponse.json(
      {
        message: "Subscription plan created successfully",
        subscriptionPlan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return NextResponse.json(
      {
        message: "Error creating subscription plan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetching subscription plans along with subscription discounts
    const subscriptionPlans = await db.subscriptionPlan.findMany({
      include: {
        subscriptionDiscount: true,
        _count: {
          select: {
            subscription: true,
            courses: true,
            Purchase: true,
          },
        },
      },
      orderBy: [
        { isDefault: "desc" },
        { isTrial: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(subscriptionPlans, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      {
        message: "Error fetching subscription plans",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
