// api/callback/route.ts
import { db } from "@/lib/db";
import { executePayment } from "@/services/bkash";
import { NextResponse, NextRequest } from "next/server";

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL!,
  username: process.env.BKASH_CHECKOUT_URL_USER_NAME!,
  password: process.env.BKASH_CHECKOUT_URL_PASSWORD!,
  app_key: process.env.BKASH_CHECKOUT_URL_APP_KEY!,
  app_secret: process.env.BKASH_CHECKOUT_URL_APP_SECRET!,
};

interface ExecutePaymentResult {
  statusCode: string;
  paymentID: string;
  trxID: string;
  amount: string | number;
  transactionStatus: string;
  paymentExecuteTime: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");

    if (!paymentID) {
      return NextResponse.redirect(
        new URL("/checkout/failed?error=No payment ID", req.url)
      );
    }

    if (status === "success") {
      // Execute the payment
      const executeResult = await executePayment(bkashConfig, paymentID);

      if (executeResult && executeResult.statusCode === "0000") {
        // Payment successful - Save to database if needed
        try {
          // Optional: Save payment record to your database
          // Uncomment and modify based on your needs
          /*
          await db.bkashPurchaseHistory.update({
            where: { bkashPaymentId: executeResult.paymentID },
            data: {
              // You can add additional fields here if needed
              // Note: The payment details should already be in the database
              // from the initial payment creation
            },
          });
          */

          return NextResponse.redirect(
            new URL(
              `/checkout/success?trxID=${executeResult.trxID}&amount=${executeResult.amount}`,
              req.url
            )
          );
        } catch (dbError) {
          console.error("Database update error:", dbError);
          // Still redirect to success if payment executed successfully
          return NextResponse.redirect(
            new URL(
              `/checkout/success?trxID=${executeResult.trxID}&amount=${executeResult.amount}`,
              req.url
            )
          );
        }
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
    console.error("[CALLBACK_ERROR]", error);
    return NextResponse.redirect(
      new URL("/checkout/failed?error=Callback processing failed", req.url)
    );
  }
}

// Handle POST requests as well (some payment gateways send POST)
export async function POST(req: NextRequest) {
  return GET(req);
}
