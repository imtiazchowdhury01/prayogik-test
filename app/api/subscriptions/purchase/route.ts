// api/subscriptions/purchase/route.ts
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import axios from "axios";
import { getServerUserSession } from "@/lib/getServerUserSession";

const addMonths = (date: Date, months: number) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const addYears = (date: Date, years: number) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

export async function POST(req: Request) {
  try {
    const { subscriptionPlanId, redirectUrl } = await req.json();

    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!subscriptionPlanId) {
      return NextResponse.json(
        { error: "Subscription plan ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const subscriptionPlan = await db.subscriptionPlan.findUnique({
      where: { id: subscriptionPlanId },
    });

    if (!subscriptionPlan) {
      return NextResponse.json(
        { error: "Subscription plan not found" },
        { status: 404 }
      );
    }

    const existingSubscription = user.studentProfile.subscription;
    const currentDate = new Date();

    if (existingSubscription && existingSubscription.expiresAt > currentDate) {
      return NextResponse.json(
        { message: "User already has an active subscription" },
        { status: 400 }
      );
    }

    let expiresAt: Date;

    if (subscriptionPlan.type === "MONTHLY") {
      expiresAt = addMonths(
        currentDate,
        subscriptionPlan.durationInMonths || 1
      );
    } else if (subscriptionPlan.type === "YEARLY") {
      expiresAt = addYears(currentDate, subscriptionPlan.durationInYears || 1);
    } else {
      expiresAt = addMonths(currentDate, 1);
    }

    const getCurrentPrice = () => {
      if (!subscriptionPlan.offerPrice) {
        return subscriptionPlan.regularPrice || 0;
      }
      return subscriptionPlan.offerPrice;
    };

    const amount = getCurrentPrice();

    const formData = {
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: user.phoneNumber || "Not available",
      amount: amount,
      tran_id: uuid(),
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
      store_id: process.env.AAMARPAY_STORE_ID,
      currency: "BDT",
      desc: `Subscription: ${subscriptionPlan.name}`,
      success_url: `${
        process.env.NEXT_PUBLIC_APP_URL
      }/api/subscriptions/webhook?subscriptionPlanId=${
        subscriptionPlan.id
      }&subscription-success=1&redirect=${encodeURIComponent(
        redirectUrl || "/"
      )}`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/webhook?subscription-failed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/webhook?subscription-cancelled=1`,
      type: "json",
      opt_a: userId,
      opt_b: subscriptionPlan.id,
    };

    const paymentUrl = process.env.AAMARPAY_URL;

    if (!paymentUrl) {
      return NextResponse.json(
        { error: "Payment gateway URL is not configured" },
        { status: 500 }
      );
    }

    const { data } = await axios.post(paymentUrl, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data.result !== "true") {
      let errorMessage = "";
      for (let key in data) {
        errorMessage += data[key] + ". ";
      }
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ url: data.payment_url });
  } catch (error) {
    console.error("Subscription purchase error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            subscription: {
              include: {
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
              },
            },
          },
        },
      },
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const subscription = user.studentProfile.subscription;

    if (!subscription) {
      return NextResponse.json(
        { message: "No subscription found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Fetch subscription error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
