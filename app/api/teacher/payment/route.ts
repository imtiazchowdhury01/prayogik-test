// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const teachers = await db.user.findMany({
      where: { role: "TEACHER" },
      include: {
        Payments: true,
        PaymentMethod: true,
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { paymentId, status } = await request.json();

    // Fetch the current payment data
    const payment = await db.payments.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment based on status
    let updatedPayment;
    if (status === "paid") {
      updatedPayment = await db.payments.update({
        where: { id: paymentId },
        data: {
          paidAmount: payment.paidAmount + payment.dueAmount,
          dueAmount: 0,
          balance: payment.balance - payment.dueAmount,
        },
      });
    } else if (status === "not_paid") {
      updatedPayment = await db.payments.update({
        where: { id: paymentId },
        data: {
          dueAmount: payment.dueAmount + payment.balance,
          balance: 0,
        },
      });
    }

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
