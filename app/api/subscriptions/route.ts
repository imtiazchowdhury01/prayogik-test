import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session: any = await getServerUserSession();

  if (!session && !session.isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { name, type, regularPrice, subscriptionDiscountId } = await req.json();

  try {
    const subscription = await db.subscriptionPlan.create({
      data: {
        name,
        type,
        regularPrice,
        subscriptionDiscountId,
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
