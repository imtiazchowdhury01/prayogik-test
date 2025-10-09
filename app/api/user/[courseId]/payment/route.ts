// @ts-nocheck
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import axios from "axios";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { useStudentProfile } from "@/hooks/useStudentProfile";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const studentProfileId = await useStudentProfile(userId);

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found or not published", {
        status: 404,
      });
    }

    // const existingPurchase = await db.purchase.findUnique({
    //   where: {
    //     userId_courseId: {
    //       userId,
    //       courseId: params.courseId,
    //     },
    //   },
    // });

    const existingPurchase = db.purchase.findFirst({
      where: {
        studentProfileId,
        courseId: params.courseId,
      },
    });

    if (existingPurchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const formData = {
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: "Not available",
      amount: course.price ?? 0,
      tran_id: uuid(),
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
      store_id: process.env.AAMARPAY_STORE_ID,
      currency: "BDT",
      desc: `Course: ${course.title}`,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback?courseId=${course.id}&success=1`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback?courseId=${course.id}&failed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/details/${course.id}?canceled=1`,
      type: "json",
      opt_a: userId,
    };

    const paymentUrl = process.env.AAMARPAY_URL;

    if (!paymentUrl) {
      return new NextResponse("Payment URL is missing", { status: 404 });
    }

    const { data } = await axios.post(paymentUrl, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data.result !== "true") {
      let errorMessage = "";
      for (let key in data) {
        errorMessage += data[key] + ". ";
      }
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ url: data.payment_url });
  } catch (error) {
    console.error("[COURSE_ID_CHECKOUT]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
