// @ts-nocheck
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { addMonths, addYears } from "@/lib/utils/expireDate/generate-expire-date";
import { NextResponse } from "next/server";
import querystring from "querystring";
import { URL } from "url";


export async function POST(req: Request) {
  const url = new URL(req.url);
  const success = url.searchParams.get("subscription-success");
  const failed = url.searchParams.get("subscription-failed");
  const subscriptionPlanId = url.searchParams.get("subscriptionPlanId");
  const redirect = url.searchParams.get("redirect");

  const rawBody = await req.text();
  const data = querystring.parse(rawBody);

  const {
    pg_txnid,
    payment_type,
    amount,
    currency,
    amount_bdt,
    amount_currency,
    rec_amount,
    processing_ratio,
    processing_charge,
    date_processed,
    pay_status,
    opt_a,
    opt_b,
  } = data;

  const userId = opt_a;
  const priceId = opt_b;
  try {
    const studentProfileId = await useStudentProfile(userId);
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (success === "1" && pay_status === "Successful") {
      const user = await db.user.findUnique({
        where: { id: userId },
      });

      // Check if subscription exists
      const subscriptionPlan = await db.subscriptionPlan.findUnique({
        where: { id: subscriptionPlanId },
      });

      if (!subscriptionPlan) {
        return NextResponse.json(
          { error: "Subscription not found" },
          { status: 404 }
        );
      }

      // Calculate expiration date based on subscription type
      let expiresAt: Date;
      const currentDate = new Date();

      if (subscriptionPlan.type === "MONTHLY") {
        expiresAt = addMonths(currentDate, 1); // Add 1 month for monthly subscription
      } else if (subscriptionPlan.type === "YEARLY") {
        expiresAt = addYears(currentDate, 1); // Add 1 year for yearly subscription
      } else {
        expiresAt = currentDate;
      }
      // Create purchase record
      await db.purchase.create({
        data: {
          studentProfileId,
          subscriptionPlanId: subscriptionPlan.id,
          purchaseType: "MEMBERSHIP", // Assuming all purchases are membership-type
          expiresAt: expiresAt,
        },
      });

      // Fetch the user's student profile based on userId
      const studentProfile = await db.studentProfile.findUnique({
        where: {
          userId: userId,
        },
        include: {
          subscription: true,
        },
      });

      // Check if the student profile exists
      if (!studentProfile) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      // Check if the user has an active subscription
      const existingSubscription = studentProfile.subscription;

      let usersSubscriptionObject;

      if (!existingSubscription) {
        usersSubscriptionObject = await db.subscription.create({
          data: {
            subscriptionPlanId: subscriptionPlan.id,
            expiresAt: expiresAt,
            status: "ACTIVE",
            studentProfileId,
            // coursePurchaseCount: 0,
          },
        });
      } else {
        // Update the existing subscription
        usersSubscriptionObject = await db.subscription.update({
          where: {
            id: studentProfile.subscription.id,
          },
          data: {
            expiresAt: expiresAt,
            status: "ACTIVE",
            // coursePurchaseCount: 0,
          },
        });
      }

      // Create payment history record
      await db.purchaseHistory.create({
        data: {
          studentProfileId: studentProfileId,
          transactionId: pg_txnid || null,
          amount: parseFloat(amount),
          unpaidBalance: parseFloat(0),
        },
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/subscription?subscription-success=1&redirect=${redirect}`,
        302
      );
    }
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/subscription?subscription-cancelled=1`,
      302
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
