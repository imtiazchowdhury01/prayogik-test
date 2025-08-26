import { executePayment } from "@/services/bkash";
import { NextResponse, NextRequest } from "next/server";

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL!,
  username: process.env.BKASH_CHECKOUT_URL_USER_NAME!,
  password: process.env.BKASH_CHECKOUT_URL_PASSWORD!,
  app_key: process.env.BKASH_CHECKOUT_URL_APP_KEY!,
  app_secret: process.env.BKASH_CHECKOUT_URL_APP_SECRET!,
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");

    console.log("Callback received:", { paymentID, status });

    if (!paymentID) {
      return NextResponse.redirect(
        new URL("/checkout/failed?error=No payment ID", req.url)
      );
    }

    if (status === "success") {
      // Execute the payment
      const executeResult = await executePayment(bkashConfig, paymentID);

      console.log("Execute payment result:", executeResult);

      if (executeResult && executeResult.statusCode === "0000") {
        // Payment successful
        // Here you can save the payment details to your database
        // const paymentRecord = {
        //   paymentID: executeResult.paymentID,
        //   trxID: executeResult.trxID,
        //   amount: executeResult.amount,
        //   transactionStatus: executeResult.transactionStatus,
        //   paymentExecuteTime: executeResult.paymentExecuteTime,
        // };
        // await db.payment.create({ data: paymentRecord });

        return NextResponse.redirect(
          new URL(
            `/checkout/success?trxID=${executeResult.trxID}&amount=${executeResult.amount}`,
            req.url
          )
        );
      } else {
        return NextResponse.redirect(
          new URL("/checkout/failed?error=Payment execution failed", req.url)
        );
      }
    } else if (status === "failure") {
      return NextResponse.redirect(
        new URL("/checkout/failed?error=Payment cancelled by user", req.url)
      );
    } else if (status === "cancel") {
      return NextResponse.redirect(new URL("/checkout/cancelled", req.url));
    } else {
      return NextResponse.redirect(
        new URL("/checkout/failed?error=Unknown status", req.url)
      );
    }
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/checkout/failed?error=Callback processing failed", req.url)
    );
  }
}

// Handle POST requests as well (some payment gateways send POST)
export async function POST(req: NextRequest) {
  return GET(req);
}
