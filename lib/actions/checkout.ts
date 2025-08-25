// @ts-nocheck
"use server";
import { PurchaseType } from "@prisma/client";
import { clearServerCart } from "./cart-cookie";
import { clientApi } from "../utils/openai/client";

export async function handleCheckout(formData: FormData) {
  console.log(formData, "form data");
  const subscriptionPlanId = formData.get("planId") as string;
  const purchasedType = formData.get("type") as string;
  const courseId = formData.get("courseId") as string;
  const email = formData.get("email") as string;
  let amount = parseInt(formData.get("amount") as string) || 0;
  console.log(amount, "amount");

  try {
    const payload = {
      email, //form data
      subscriptionPlanId, //form data
      courseId,
      amount:
        purchasedType === "TRIAL" ? 0 : Number(parseFloat(amount).toFixed(2)), //form data
      type: purchasedType,
    };

    if (purchasedType === "TRIAL") {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/payment-callback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (data.success) {
        console.log("Trial successfully chekout:", data);
        await clearServerCart();
        return {
          success: data.success,
          message: data.message,
          data: data?.data,
        };
      } else {
        console.log("Trial unsuccessful:", data);

        await clearServerCart();
        return { success: false };
      }
    } else {
      const bkashPaymentReq = await clientApi.postBkashPayment({
        body: payload,
      });

      const bkashPaymentRes = await bkashPaymentReq.body;
      console.log(bkashPaymentRes, "bkashPaymentRes");

      // Bkash payment url is not present then throw error
      if (!bkashPaymentRes?.url) {
        throw new Error(bkashPaymentRes?.statusMessage || "Payment failed");
      }

      // Return success status & data
      return { success: true, data: bkashPaymentRes };
    }
  } catch (error) {
    console.error("Checkout error:", error);
    // Return failure status & error message
    return {
      success: false,
      message: data?.message || "An unexpected error occurred",
      data: null,
    };
  }
}
