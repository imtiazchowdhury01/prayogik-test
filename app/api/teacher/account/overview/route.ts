// api/teacher/account/overview/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teacherProfileId = searchParams.get("teacherProfileId");

  if (!teacherProfileId) {
    return NextResponse.json(
      { error: "teacherProfileId is required" },
      { status: 400 }
    );
  }

  try {
    const balance = await db.teacherBalance.findFirst({
      where: { teacherProfileId },
      select: {
        balance_remaining: true,
        month: true,
        total_earned: true,
        total_paid: true,
        year: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const lastTransaction = await db.teacherPayments.findFirst({
      where: { teacherProfileId },
      orderBy: {
        payment_date: "desc",
      },
      select: {
        payment_date: true,
      },
    });

    const response = {
      remaining_balance: balance ? balance.balance_remaining : 0,
      total_earned: balance ? balance.total_earned : 0,
      month: balance ? balance.month : 0,
      year: balance ? balance.year : 0,
      total_payments: balance ? balance.total_paid : 0,
      last_transaction_date: lastTransaction
        ? lastTransaction.payment_date
        : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
