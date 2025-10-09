// api/admin/teachers/earnings/pay/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { updateTeacherBalance } from "@/lib/utils/purchase";
import { NextResponse } from "next/server";
import { TeacherPaymentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId, isAdmin } = await getServerUserSession();
    if (!userId || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { earningId, amount_paid, payment_status } = body as {
      earningId: string;
      amount_paid: number;
      payment_status: TeacherPaymentStatus;
    };

    if (!earningId || !amount_paid || !payment_status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const earningRecord = await db.teacherMonthlyEarnings.findUnique({
      where: { id: earningId },
    });

    if (!earningRecord) {
      return NextResponse.json(
        { error: "Earning record not found" },
        { status: 404 }
      );
    }

    const { teacherProfileId, month, year, total_earned } = earningRecord;

    const payments = await db.teacherPayments.findMany({
      where: {
        teacherProfileId,
        month_paid_for: month,
        year_paid_for: year,
      },
    });

    const total_paid = payments.reduce(
      (sum, payment) => sum + payment.amount_paid,
      0
    );
    const balance_remaining = total_earned - total_paid;

    if (amount_paid > balance_remaining) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const newPayment = await db.teacherPayments.create({
      data: {
        teacherProfileId,
        amount_paid,
        month_paid_for: month,
        year_paid_for: year,
        payment_status,
        payment_date: new Date(),
      },
    });

    if (newPayment) {
      await updateTeacherBalance(teacherProfileId);
    }

    return NextResponse.json(
      { message: "Payment recorded successfully", data: newPayment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
