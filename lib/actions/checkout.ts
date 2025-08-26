// @ts-nocheck
"use server";
import { PurchaseType } from "@prisma/client";
import { clearServerCart } from "./cart-cookie";
import { clientApi } from "../utils/openai/client";

export async function handleCheckout(formData: FormData) {
  const subscriptionPlanId = formData.get("planId") as string;
  const purchasedType = formData.get("type") as string;
  const courseId = formData.get("courseId") as string;
  const email = formData.get("email") as string;
  let amount = parseInt(formData.get("amount") as string) || 0;

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscriptions/purchase/trial`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (data.success) {
        // console.log("ট্রায়াল নেয়া হয়েছে", data);
        await clearServerCart();
        return {
          success: data.success,
          message: data.message,
          data: data?.data,
        };
      } else {
        console.log("ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন!", data);

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
      // Clear server cart after successful payment
      // await clearServerCart();
      // Return success status & data
      return { success: true, data: bkashPaymentRes };
    }
  } catch (error) {
    console.error("Checkout error:", error);
    // Return failure status & error message
    return {
      success: false,
      message: error?.message || "An unexpected error occurred",
      data: null,
    };
  }
}
