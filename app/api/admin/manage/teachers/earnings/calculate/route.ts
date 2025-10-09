import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface RequestBody {
  isAdmin: boolean;
}

export async function POST(req: Request) {
  try {
    const { isAdmin }: RequestBody = await req.json();

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const teacherRevenues = await db.teacherRevenue.groupBy({
      by: ["teacherProfileId", "month", "year"],
      _sum: {
        amount: true,
      },
    });

    for (const revenue of teacherRevenues) {
      const { teacherProfileId, month, year, _sum } = revenue;
      const totalEarned = _sum.amount || 0;

      const existingEarnings = await db.teacherMonthlyEarnings.findFirst({
        where: {
          teacherProfileId,
          month,
          year,
        },
      });

      if (existingEarnings) {
        await db.teacherMonthlyEarnings.update({
          where: {
            id: existingEarnings.id,
          },
          data: {
            total_earned: totalEarned,
          },
        });
      } else {
        await db.teacherMonthlyEarnings.create({
          data: {
            teacherProfileId,
            month,
            year,
            total_earned: totalEarned,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Teacher monthly earnings generated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating teacher monthly earnings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
