// api/admin/teachers/earnings/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface MonthlyData {
  id: string;
  month: number;
  year: number;
  earned: number;
  paid: number;
  remaining: number;
  status: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teacherProfileId } = body as { teacherProfileId: string };

    if (!teacherProfileId) {
      return NextResponse.json(
        { message: "Teacher Profile ID is required" },
        { status: 400 }
      );
    }

    const monthlyEarnings = await db.teacherMonthlyEarnings.findMany({
      where: {
        teacherProfileId: teacherProfileId,
      },
      select: {
        id: true,
        month: true,
        year: true,
        total_earned: true,
      },
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
      ],
    });

    const payments = await db.teacherPayments.findMany({
      where: {
        teacherProfileId: teacherProfileId,
      },
      orderBy: [
        {
          year_paid_for: "desc",
        },
        {
          month_paid_for: "desc",
        },
      ],
    });

    const monthlyDataMap = new Map<string, MonthlyData>();

    monthlyEarnings.forEach((earning) => {
      const key = `${earning.year}-${earning.month}`;
      monthlyDataMap.set(key, {
        id: earning.id,
        month: earning.month,
        year: earning.year,
        earned: earning.total_earned,
        paid: 0,
        remaining: earning.total_earned,
        status: "UNPAID",
      });
    });

    payments.forEach((payment) => {
      const key = `${payment.year_paid_for}-${payment.month_paid_for}`;
      if (monthlyDataMap.has(key)) {
        const data = monthlyDataMap.get(key)!;
        data.paid += payment.amount_paid;
        data.remaining = data.earned - data.paid;
        data.status = data.remaining === 0 ? "PAID" : "DUE";
      }
    });

    const monthlyData = Array.from(monthlyDataMap.values()).sort((a, b) => {
      if (a.year === b.year) {
        return b.month - a.month;
      }
      return b.year - a.year;
    });

    return NextResponse.json(monthlyData, { status: 200 });
  } catch (error) {
    console.error("Error fetching monthly earnings:", error);
    return NextResponse.json(
      { message: "Failed to fetch monthly earnings" },
      { status: 500 }
    );
  }
}
