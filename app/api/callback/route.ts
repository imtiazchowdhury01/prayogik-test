// @ts-nocheck
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import {
  updateTeacherBalance,
  updateTeacherMonthlyEarnings,
  enrollStudentToTheCourse,
} from "@/lib/utils/purchase";
import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";
import { URL } from "url";

// Constants
const FREQUENCY_YEARLY = "yearly";
const FREQUENCY_MONTHLY = "monthly";
const FREQUENCY_LIFETIME = "lifetime";
const PAYMENT_STATUS_SUCCESSFUL = "Successful";
const PURCHASE_TYPE_SINGLE_COURSE = "SINGLE_COURSE";

// Utility function to calculate expiry date
const getExpiryDate = (frequency: string, duration: number): Date | null => {
  const currentDate = new Date();

  switch (frequency.toLowerCase()) {
    case FREQUENCY_YEARLY:
      return new Date(
        Date.UTC(
          currentDate.getUTCFullYear() + duration,
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          currentDate.getUTCHours(),
          currentDate.getUTCMinutes(),
          currentDate.getUTCSeconds()
        )
      );
    case FREQUENCY_MONTHLY:
      return new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth() + duration,
          currentDate.getUTCDate(),
          currentDate.getUTCHours(),
          currentDate.getUTCMinutes(),
          currentDate.getUTCSeconds()
        )
      );
    case FREQUENCY_LIFETIME:
      return null;
    default:
      throw new Error(
        'Invalid frequency provided. Use "yearly", "monthly", or "lifetime".'
      );
  }
};

// Utility function to calculate teacher revenue
const calculateTeacherRevenue = (
  percentage: number,
  amount: number
): number => {
  const revenue = (percentage / 100) * amount;
  return parseFloat(revenue.toFixed(2));
};

// Main API route
export async function POST(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");
  const success = url.searchParams.get("success");
  const failedPayment = url.searchParams.get("failed");

  try {
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is missing" },
        { status: 400 }
      );
    }

    const rawBody = await req.text();
    const data = querystring.parse(rawBody);

    const {
      pg_txnid,
      payment_type,
      amount,
      currency,
      amount_bdt,
      amount_currency,
      rec_amount,
      processing_ratio,
      processing_charge,
      date_processed,
      pay_status,
      opt_a: userId,
      opt_b: priceId,
      opt_c: isSubscribedUser,
      opt_d: isPurchasingUnderSubscriptionPrice,
    } = data;

    if (
      !userId ||
      success !== "1" ||
      pay_status !== PAYMENT_STATUS_SUCCESSFUL
    ) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?cancelled=1`,
        302
      );
    }

    // fetch user, course and price
    const [user, course, price] = await Promise.all([
      db.user.findUnique({ where: { id: userId as string } }),
      db.course.findUnique({
        where: { id: courseId, isPublished: true },
        include: {
          lessons: true,
          enrolledStudents: true,
          // subscriptionDiscount: true,
        },
      }),
      db.price.findUnique({ where: { id: priceId as string } }),
    ]);

    if (!user || !course || !price) {
      return NextResponse.json(
        { error: "User, Course, or Price not found" },
        { status: 404 }
      );
    }

    const studentProfileId = await useStudentProfile(user.id);
    const teacherProfileId = course.teacherProfileId;

    const expiresAt = getExpiryDate(price.frequency, price.duration);

    if (expiresAt && isNaN(expiresAt.getTime())) {
      throw new Error("Invalid expiry date calculated");
    }

    // fetch teacher profile
    const teacher = await db.teacherProfile.findUnique({
      where: { id: teacherProfileId },
      include: { teacherRank: true },
    });

    if (!teacher || !teacher.teacherRankId) {
      return NextResponse.json(
        { error: "Teacher not found or no rank assigned" },
        { status: 404 }
      );
    }

    // fetch and sort ranks
    const unsortedRanks = await db.teacherRank.findMany();
    const ranks = unsortedRanks.sort(
      (a, b) => a.numberOfSales - b.numberOfSales
    );

    const teacherRankDetails = ranks.find(
      (r) => r.id === teacher?.teacherRankId
    );

    const teacherRevenuePercentage = teacher.teacherRank?.feePercentage || 0; //TODO: set a default percentage
    const teacherRevenue = calculateTeacherRevenue(
      teacherRevenuePercentage,
      parseFloat(amount as string)
    );

    // 1. create purchase
    const newPurchase = await db.purchase.create({
      data: {
        studentProfileId,
        teacherProfileId,
        courseId,
        purchaseType: PURCHASE_TYPE_SINGLE_COURSE,
        expiresAt,
        aamarPayData: {
          create: {
            pg_txnid,
            payment_type: payment_type || "",
            amount,
            currency,
            amount_bdt: amount_bdt ? String(amount_bdt) : "0",
            amount_currency,
            rec_amount: rec_amount ? String(rec_amount) : "",
            processing_ratio: processing_ratio ? String(processing_ratio) : "",
            processing_charge: processing_charge
              ? String(processing_charge)
              : "",
            date_processed: date_processed
              ? new Date(date_processed).toISOString()
              : new Date().toISOString(),
          },
        },
        TeacherRevenue: {
          create: {
            teacherProfileId,
            amount: teacherRevenue,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            teacherRankId: teacher.teacherRank?.id || "",
          },
        },
      },
    });

    // 2. create purchase history
    await db.purchaseHistory.create({
      data: {
        studentProfileId,
        transactionId: pg_txnid || null,
        amount: parseFloat(amount),
        unpaidBalance: parseFloat(0),
      },
    });

    // 3. enroll student to the course
    if (newPurchase) {
      await enrollStudentToTheCourse(
        course,
        studentProfileId,
        teacherProfileId,
        ranks
      );
    }

    // 4.  Update or create teacher's monthly earnings
    await updateTeacherMonthlyEarnings(teacherProfileId, teacherRevenue);

    // 5. Update Teacher Balance
    if (newPurchase) {
      await updateTeacherBalance(teacherProfileId);
    }

    // 6. if purchase under subscription, update purchase count - no need
    // if (isSubscribedUser && isPurchasingUnderSubscriptionPrice) {
    //   await updateCoursePurchaseCount(studentProfileId);
    // }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/${course.lessons[0]?.slug}?success=1`,
      302
    );
  } catch (error) {
    console.error("[CALLBACK_ERROR]", error);

    try {
      // Fetch course details for redirect since course variable might not be available
      const courseForRedirect = await db.course.findUnique({
        where: { id: courseId, isPublished: true },
        select: { slug: true },
      });

      const redirectUrl = courseForRedirect?.slug
        ? `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseForRedirect.slug}?cancelled=1`
        : `${process.env.NEXT_PUBLIC_APP_URL}?cancelled=1`;

      return NextResponse.redirect(redirectUrl, 302);
    } catch (redirectError) {
      console.error("[REDIRECT_ERROR]", redirectError);

      // Fallback redirect if we can't fetch course details
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}?cancelled=1`,
        302
      );
    }
  }
}
