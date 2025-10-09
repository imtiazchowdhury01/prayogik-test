// api/bkash/payment/route.ts
import { db } from "@/lib/db";
import { createPayment } from "@/services/bkash";
import { NextResponse, NextRequest } from "next/server";
import type { PurchaseType } from "@prisma/client";

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL!,
  username: process.env.BKASH_CHECKOUT_URL_USER_NAME!,
  password: process.env.BKASH_CHECKOUT_URL_PASSWORD!,
  app_key: process.env.BKASH_CHECKOUT_URL_APP_KEY!,
  app_secret: process.env.BKASH_CHECKOUT_URL_APP_SECRET!,
};

interface PaymentRequest {
  email: string;
  subscriptionPlanId?: string | null;
  courseId?: string | null;
  certificationId?: string | null;
  amount: number;
  type: PurchaseType;
  eventId?: string | null;
  phoneNumber?: string | null;
  profession?: string | null;
  name?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const requestBody: PaymentRequest = await req.json();
    const {
      email,
      subscriptionPlanId,
      courseId,
      certificationId,
      amount,
      type,
      eventId,
      phoneNumber,
      profession,
      name,
    } = requestBody;

    // Validate required fields
    if (!email || !amount || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    const order = await db.bkashPurchaseHistory.create({
      data: {
        email: email,
        amount: Number(amount),
        subscriptionPlanId: subscriptionPlanId || null,
        courseId: courseId || null,
        certificationId: certificationId || null,
        purchaseType: type,
        eventId: eventId || null,
        phoneNumber: phoneNumber || null,
        profession: profession || null,
        name: name || null,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Payment order creation failed" },
        { status: 500 }
      );
    }

    const paymentDetails = {
      amount: Number(amount),
      orderId: order.id,
      reference: order.id,
      callbackURL: `${baseUrl}/api/bkash/callback`,
    };

    const createPaymentResponse = await createPayment(
      bkashConfig,
      paymentDetails
    );

    if (createPaymentResponse.statusCode !== "0000") {
      return NextResponse.json({ message: "Payment failed" }, { status: 400 });
    }

    await db.bkashPurchaseHistory.update({
      where: { id: order.id },
      data: { bkashPaymentId: createPaymentResponse?.paymentID },
    });

    return NextResponse.json({
      message: "Payment success",
      url: createPaymentResponse.bkashURL,
    });
  } catch (error) {
    console.error("[BKASH_PAYMENT_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
