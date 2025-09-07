import { clearServerCart } from "@/lib/actions/cart-cookie";
import { clientApi } from "../openai/client";

export async function handleTrialPurchase(payload: any) {
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
    await clearServerCart();
    return {
      success: data.success,
      message: data.message,
      data: data?.data,
    };
  } else {
    console.log("ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন!", data);
    return { success: false };
  }
}

export async function handleEventPurchase(payload: any) {
  // First handle trial API
  const trialResult = await handleTrialPurchase(payload);

  if (!trialResult.success) {
    return trialResult;
  }

  // Then handle bkash payment
  return await handleBkashPayment(payload);
}

export async function handleBkashPayment(payload: any) {
  const bkashPaymentReq = await clientApi.postBkashPayment({
    body: payload,
  });

  const bkashPaymentRes: any = await bkashPaymentReq.body;

  // Bkash payment url is not present then throw error
  if (!bkashPaymentRes?.url) {
    throw new Error(bkashPaymentRes?.statusMessage || "Payment failed");
  }

  return { success: true, data: bkashPaymentRes };
}
