// api/subscriptions/webhook/route.ts
import { db } from "@/lib/db";
import {
  addMonths,
  addYears,
} from "@/lib/utils/expireDate/generate-expire-date";
import { NextResponse } from "next/server";
import querystring from "querystring";
import { URL } from "url";
import {
  PurchaseType,
  PaymentStatus,
  SubscriptionStatus,
} from "@prisma/client";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const success = url.searchParams.get("subscription-success");
    const failed = url.searchParams.get("subscription-failed");
    const subscriptionPlanId = url.searchParams.get("subscriptionPlanId");
    const redirect = url.searchParams.get("redirect") || "/";

    if (!subscriptionPlanId) {
      return NextResponse.json(
        { error: "Subscription plan ID is required" },
        { status: 400 }
      );
    }

    const rawBody = await req.text();
    const data = querystring.parse(rawBody) as Record<string, string>;

    const {
      pg_txnid,
      payment_type,
      amount,
      currency,
      amount_bdt,
      pay_status,
      opt_a: userId,
      opt_b: priceId,
    } = data;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 }
      );
    }

    // Validate user exists
    const user = await db.user.findUnique({
      where: { id: userId as string },
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
        { error: "User or student profile not found" },
        { status: 404 }
      );
    }

    const studentProfileId = user.studentProfile.id;

    // Handle successful payment
    if (success === "1" && pay_status === "Successful") {
      // Fetch subscription plan
      const subscriptionPlan = await db.subscriptionPlan.findUnique({
        where: { id: subscriptionPlanId },
      });

      if (!subscriptionPlan) {
        return NextResponse.json(
          { error: "Subscription plan not found" },
          { status: 404 }
        );
      }

      // Calculate expiration date
      let expiresAt: Date;
      const currentDate = new Date();

      if (subscriptionPlan.type === "MONTHLY") {
        expiresAt = addMonths(
          currentDate,
          subscriptionPlan.durationInMonths || 1
        );
      } else if (subscriptionPlan.type === "YEARLY") {
        expiresAt = addYears(
          currentDate,
          subscriptionPlan.durationInYears || 1
        );
      } else {
        // Default to 1 month if type is not specified
        expiresAt = addMonths(currentDate, 1);
      }

      const amountPaid = parseFloat(amount as string) || 0;

      // Use transaction to ensure data consistency
      const result = await db.$transaction(async (prisma) => {
        // Create purchase record with all required fields
        const purchase = await prisma.purchase.create({
          data: {
            studentProfileId,
            subscriptionPlanId: subscriptionPlan.id,
            purchaseType: "SUBSCRIPTION" as PurchaseType,
            expiresAt: expiresAt,
            totalAmountTk: amountPaid,
            creditsUsedTk: 0,
            totalPaidTk: amountPaid,
            remainingAmountTk: 0,
            paymentStatus: "COMPLETED" as PaymentStatus,
            fullyPaidAt: new Date(),
          },
        });

        // Create mobile payment record
        await prisma.mobilePayment.create({
          data: {
            purchaseId: purchase.id,
            amountTk: amountPaid,
            provider: (payment_type as string) || "bKash",
            phoneNumber: user.phoneNumber || "N/A",
            mobileTransactionId: pg_txnid as string,
            status: "COMPLETED" as PaymentStatus,
            idempotencyKey: `webhook-${pg_txnid}-${Date.now()}`,
            processedAt: new Date(),
            metadata: {
              currency: currency,
              amount_bdt: amount_bdt,
            },
          },
        });

        // Create or update subscription
        const existingSubscription = user.studentProfile?.subscription;

        let subscription;
        if (!existingSubscription) {
          subscription = await prisma.subscription.create({
            data: {
              subscriptionPlanId: subscriptionPlan.id,
              expiresAt: expiresAt,
              status: "ACTIVE" as SubscriptionStatus,
              studentProfileId,
              isTrial: false,
            },
          });
        } else {
          subscription = await prisma.subscription.update({
            where: {
              id: existingSubscription.id,
            },
            data: {
              subscriptionPlanId: subscriptionPlan.id,
              expiresAt: expiresAt,
              status: "ACTIVE" as SubscriptionStatus,
              updatedAt: new Date(),
            },
          });
        }

        // Create purchase history record
        await prisma.purchaseHistory.create({
          data: {
            studentProfileId: studentProfileId,
            transactionId: (pg_txnid as string) || null,
            amount: amountPaid,
            unpaidBalance: 0,
          },
        });

        // Update user's current plan
        await prisma.user.update({
          where: { id: userId as string },
          data: {
            currentPlan: "PRIME",
          },
        });

        return { purchase, subscription };
      });

      // Redirect to success page
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL
        }/subscription?subscription-success=1&redirect=${encodeURIComponent(
          redirect
        )}`,
        302
      );
    }

    // Handle failed payment
    if (failed === "1" || pay_status !== "Successful") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/subscription?subscription-failed=1`,
        302
      );
    }

    // Default: redirect to cancelled
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/subscription?subscription-cancelled=1`,
      302
    );
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
