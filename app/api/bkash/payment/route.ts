import { db } from "@/lib/db";
import { createPayment } from "@/services/bkash";
import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL!,
  username: process.env.BKASH_CHECKOUT_URL_USER_NAME!,
  password: process.env.BKASH_CHECKOUT_URL_PASSWORD!,
  app_key: process.env.BKASH_CHECKOUT_URL_APP_KEY!,
  app_secret: process.env.BKASH_CHECKOUT_URL_APP_SECRET!,
};

export async function POST(req: NextRequest) {
  try {
    const { email, subscriptionPlanId, courseId, amount, type } =
      await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    const order = await db.bkashPurchaseHistory.create({
      data: {
        email: email,
        amount: Number(amount),
        subscriptionPlanId: subscriptionPlanId,
        courseId: courseId,
        purchaseType: type,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Payment Failed" });
    }

    const paymentDetails = {
      amount,
      orderId: order.id,
      reference: order.id,
      callbackURL: `${baseUrl}/api/bkash/callback`,
    };

    console.log("Payment Details:", paymentDetails);

    const createPaymentResponse = await createPayment(
      bkashConfig,
      paymentDetails
    );
    console.log(createPaymentResponse);

    if (createPaymentResponse.statusCode !== "0000") {
      return NextResponse.json({ message: "Payment Failed" });
    }

    await db.bkashPurchaseHistory.update({
      where: { id: order.id },
      data: { bkashPaymentId: createPaymentResponse?.paymentID },
    });

    return NextResponse.json({
      message: "Payment Success",
      url: createPaymentResponse.bkashURL,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" });
  }
}
