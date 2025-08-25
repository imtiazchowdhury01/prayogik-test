"use server";

import { db } from "@/lib/db";
import { clientApi } from "@/lib/utils/openai/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const bkashManualPaymentAction = async (
  paymentData: any,
  type: any,
  title: any,
  price: any,
  courseId: string
) => {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });
  const res = await clientApi.createBkashPayment({
    body: {
      payFrom: paymentData.payFrom,
      trxId: paymentData.trxId,
      type,
      subscriptionId: paymentData.subscriptionId!,
      courseId: paymentData.courseId!,
      payableAmount: price,
      title,
    },
    extraHeaders: {
      cookie: cookies().toString(),
    },
  });

  if (res.status === 201) {
    revalidatePath(`/courses/${course?.slug!}`);
    
    return res;
  }
  return res;
};
