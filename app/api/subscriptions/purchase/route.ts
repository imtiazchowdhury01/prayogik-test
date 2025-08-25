// @ts-nocheck
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import axios from "axios";
import { getServerUserSession } from "@/lib/getServerUserSession";

// Helper function to add months or years to the current date
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

    // Check if subscription exists
    const subscription = await db.subscriptionPlan.findUnique({
      where: { id: subscriptionPlanId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Check if user is already subscribed to the same plan
    // const existingSubscription = await db.subscription.findFirst({
    //   where: {
    //     userId: userId,
    //     subscriptionPlanId,

    //     // expiresAt: {
    //     //   gt: new Date(), // Make sure the subscription is still active
    //     // },
    //   },
    // });

    // const existingSubscription = await db.subscription.findFirst({
    //   where: {
    //     StudentProfile: {
    //       some: {
    //         userId: userId,
    //       },
    //     },
    //     subscriptionPlanId,
    //     expiresAt: {
    //       gt: new Date(), // Make sure the subscription is still active
    //     },
    //   },
    // });

    // Check for existing subscription for the student profile
    const existingSubscription = user?.studentProfile?.subscription;

    // Current date from the user's device
    const currentDate = new Date();
    if (existingSubscription && existingSubscription.expiresAt > currentDate) {
      // Subscription is still active
      return NextResponse.json(
        { message: "User already subscribed to this plan." },
        { status: 400 } // You can return a 400 or 200 with a message
      );
    }

    // if (existingSubscription) {
    //   return NextResponse.json(
    //     { message: "User already subscribed to this plan." },
    //     { status: 400 } // You can return a 400 or 200 with a message
    //   );
    // }

    // Calculate expiration date based on subscription type
    let expiresAt: Date;

    if (subscription.type === "MONTHLY") {
      expiresAt = addMonths(currentDate, 1); // Add 1 month for monthly subscription
    } else if (subscription.type === "YEARLY") {
      expiresAt = addYears(currentDate, 1); // Add 1 year for yearly subscription
    } else {
      expiresAt = currentDate;
    }

    const getCurrentPrice = (subscription) => {
      const currentDate = new Date();
      const discountExpiryDate = new Date(subscription?.discountExpiresOn);

      // Check if the discount has expired
      if (currentDate > discountExpiryDate) {
        return subscription.regularPrice; // Show regular price
      }
      return subscription.regularPrice; // Show discounted price if available
    };

    const formData = {
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: "Not available",
      amount: subscription.regularPrice,
      tran_id: uuid(),
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
      store_id: process.env.AAMARPAY_STORE_ID,
      currency: "BDT",
      desc: `subscription type: ${subscription.type}`,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/webhook?subscriptionPlanId=${subscription.id}&subscription-success=1&redirect=${redirectUrl}`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/webhook?subscription-failed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/webhook?subscription-cancelled=1`,
      type: "json",
      opt_a: userId,
      opt_b: subscription.id,
    };

    const paymentUrl = process.env.AAMARPAY_URL;

    if (!paymentUrl) {
      return new NextResponse("Payment URL is missing", { status: 404 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// get users purchased subscription
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
            subscription: true,
          },
        },
      },
    });

    // Retrieve subscription associated with the student profile
    const subscriptions = await db?.studentProfile?.subscription;

    // Check if the user has any subscriptions
    if (subscriptions.length === 0) {
      return NextResponse.json(
        { message: "No subscriptions found for this user." },
        { status: 404 }
      );
    }

    // Return the list of subscriptions
    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
