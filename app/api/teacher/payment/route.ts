// api/teacher/payment/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const teachers = await db.user.findMany({
      where: { role: "TEACHER" },
      include: {
        teacherProfile: {
          include: {
            teacherPayments: true,
            bankAccounts: true,
          },
        },
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

    const payment = await db.teacherPayments.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    let updatedPayment;
    if (status === "paid") {
      updatedPayment = await db.teacherPayments.update({
        where: { id: paymentId },
        data: {
          amount_paid: payment.amount_paid,
          payment_status: "PAID",
          payment_date: new Date(),
        },
      });
    } else if (status === "not_paid") {
      updatedPayment = await db.teacherPayments.update({
        where: { id: paymentId },
        data: {
          payment_status: "UNPAID",
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
