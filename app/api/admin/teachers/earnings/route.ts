import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body to get the teacherProfileId
    const { teacherProfileId } = await req.json();

    if (!teacherProfileId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    // Fetch the monthly earnings for the given teacherProfileId
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

    // Fetch the payments for the given teacherProfileId
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

    // Create a map to store the calculated data for each month
    const monthlyDataMap = new Map<
      string,
      {
        id: string;
        month: number;
        year: number;
        earned: number;
        paid: number;
        remaining: number;
        status: string;
      }
    >();

    // Calculate the earned amount for each month
    monthlyEarnings.forEach((earning) => {
      const key = `${earning.year}-${earning.month}`;
      monthlyDataMap.set(key, {
        id: earning.id, // Include the id of the teacherMonthlyEarnings record
        month: earning.month,
        year: earning.year,
        earned: earning.total_earned,
        paid: 0,
        remaining: earning.total_earned,
        status: "UNPAID",
      });
    });

    // Calculate the paid amount for each month
    payments.forEach((payment) => {
      const key = `${payment.year_paid_for}-${payment.month_paid_for}`;
      if (monthlyDataMap.has(key)) {
        const data = monthlyDataMap.get(key)!;
        data.paid += payment.amount_paid;
        data.remaining = data.earned - data.paid;
        data.status = data.remaining === 0 ? "PAID" : "DUE";
      }
      // If there's no earning record for this payment, skip creating a new entry
    });

    // Convert the map to an array of the desired format
    const monthlyData = Array.from(monthlyDataMap.values()).sort((a, b) => {
      if (a.year === b.year) {
        return b.month - a.month;
      }
      return b.year - a.year;
    });

    // Return the calculated data
    return NextResponse.json(monthlyData, { status: 200 });
  } catch (error) {
    console.error("Error fetching monthly earnings:", error);
    return NextResponse.json(
      { message: "Failed to fetch monthly earnings" },
      { status: 500 }
    );
  }
}
