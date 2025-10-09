// @ts-nocheck
"use server";
import { PurchaseType } from "@prisma/client";

import {
  handleBkashPayment,
  handleTrialPurchase,
} from "../utils/checkout/client";
import { processDevPayment } from "../utils/checkout/dev-payment";

export async function handleCheckout(formData: FormData) {
  const subscriptionPlanId = formData.get("planId") as string;
  const purchasedType = formData.get("type") as string;
  const courseId = formData.get("courseId") as string;
  const certificationId = formData.get("certificationId") as string;
  const email = formData.get("email") as string;
  let amount = parseInt(formData.get("amount") as string) || 0;
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const profession = formData.get("profession") as string;
  const phoneNumber = formData.get("mobile") as string;
  const isFreeCourse = formData.get("isFreeCourse") as boolean;

  const payload = {
    email,
    subscriptionPlanId:
      purchasedType === PurchaseType.SINGLE_COURSE ? null : subscriptionPlanId,
    eventId,
    courseId,
    certificationId,
    name,
    email,
    phoneNumber,
    profession,
    amount: Number(parseFloat(amount).toFixed(2)),
    type: purchasedType,
    isFreeCourse, // For Free Course Access
  };

  try {
    // if (process.env.NODE_ENV === 'development') {
    //   return await processDevPayment(payload);

    //   // console.log("Checkout Payload:", payload);
    // }
    // else {
      return await handleBkashPayment(payload);
    // }
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message: error?.message || "An unexpected error occurred",
      data: null,
    };
  }
}
