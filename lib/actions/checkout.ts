// @ts-nocheck
"use server";
import { PurchaseType } from "@prisma/client";
import { clearServerCart } from "./cart-cookie";
import { clientApi } from "../utils/openai/client";
import {
  handleBkashPayment,
  handleEventPurchase,
  handleTrialPurchase,
} from "../utils/checkout/client";

export async function handleCheckout(formData: FormData) {
  const subscriptionPlanId = formData.get("planId") as string;
  const purchasedType = formData.get("type") as string;
  const courseId = formData.get("courseId") as string;
  const email = formData.get("email") as string;
  let amount = parseInt(formData.get("amount") as string) || 0;
  //
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const profession = formData.get("profession") as string;
  const phoneNumber = formData.get("mobile") as string;

  const payload = {
    email,
    subscriptionPlanId:
      purchasedType === PurchaseType.SINGLE_COURSE ? null : subscriptionPlanId,
    eventId,
    courseId,
    name,
    email,
    phoneNumber,
    profession,
    amount:
      purchasedType === PurchaseType.TRIAL
        ? 0
        : Number(parseFloat(amount).toFixed(2)),
    type: purchasedType,
  };

  try {
    switch (purchasedType) {
      case PurchaseType.TRIAL:
        return await handleTrialPurchase(payload);

      default:
        return await handleBkashPayment(payload);
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message: error?.message || "An unexpected error occurred",
      data: null,
    };
  }
}
