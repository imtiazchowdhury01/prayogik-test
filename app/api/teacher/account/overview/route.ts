// @ts-nocheck
import { db } from "@/lib/db";
import { PrismaClient } from "@db.ient";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  // Ensure it's a GET request and contains teacherProfileId
  const { searchParams } = new URL(req.url);
  const teacherProfileId = searchParams.get("teacherId");

  if (!teacherProfileId) {
    return NextResponse.json(
      { error: "teacherProfileId is required" },
      { status: 400 }
    );
  }

  try {
    // Get the TeacherBalance for the given teacherProfileId
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

    // Get the last payment date
    const lastTransaction = await db.teacherPayments.findFirst({
      where: { teacherProfileId },
      orderBy: {
        payment_date: "desc",
      },
      select: {
        payment_date: true,
      },
    });

    // Prepare response
    const response = {
      remaining_balance: balance ? balance.balance_remaining : 0,
      total_earned: balance ? balance.total_earned : 0,
      month: balance ? balance.month : "N/A",
      year: balance ? balance.year : "N/A",
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
