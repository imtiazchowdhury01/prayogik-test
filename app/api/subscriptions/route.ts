import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session: any = await getServerUserSession();

  if (!session && !session.isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const trialPlan = await db.subscriptionPlan.findFirst({
    where: {
      isTrial: true,
    },
  });

  try {
    if (body.isTrial && trialPlan) {
      // Trial subscription plan exists
      return NextResponse.json(
        {
          message: "A trial subscription plan is already available.",
        },
        { status: 409 }
      );
    }
    const subscription = await db.subscriptionPlan.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating subscription", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetching subscription plans along with subscription discounts
    const subscriptions = await db.subscriptionPlan.findMany({
      include: {
        subscriptionDiscount: true,
        _count: {
          select: {
            subscription: true,
          },
        },
      },
    });

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error fetching subscriptions",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
