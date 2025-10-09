// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { updateTeacherBalance } from "@/lib/utils/purchase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Verify if the user is an admin
    const { userId, isAdmin } = await getServerUserSession();
    if (!userId || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { earningId, amount_paid, payment_status } = await req.json();

    // Validate the request body
    if (!earningId || !amount_paid || !payment_status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the earning record
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

    // Calculate total paid so far for the specific month and year
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

    // Validate if the requested amount_paid is valid
    if (amount_paid > balance_remaining) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    // Create a new payment record
    const newPayment = await db.teacherPayments.create({
      data: {
        teacherProfileId,
        amount_paid,
        month_paid_for: month,
        year_paid_for: year,
        payment_status,
        payment_date: new Date(), // Set the payment date to the current date
      },
    });

    // Call the utitlity update Teacher Balance
    if (newPayment) {
      updateTeacherBalance(teacherProfileId);
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
