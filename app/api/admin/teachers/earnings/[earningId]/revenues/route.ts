// api/admin/teachers/earnings/[earningId]/revenues/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

interface FormattedRevenue {
  revenueDate: Date;
  month: number;
  year: number;
  amount: number;
  revenueTeacherRank: string;
  revenuePercentage: number;
  course: string;
}

export async function GET(
  req: Request,
  { params }: { params: { earningId: string } }
) {
  try {
    const { earningId } = params;

    if (!earningId) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const { isAdmin } = await getServerUserSession();
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 401 }
      );
    }

    const earning = await db.teacherMonthlyEarnings.findUnique({
      where: {
        id: earningId,
      },
      include: {
        teacherProfile: true,
      },
    });

    if (!earning) {
      return NextResponse.json(
        { message: "Earning not found" },
        { status: 404 }
      );
    }

    const { teacherProfileId, month, year } = earning;

    const revenues = await db.teacherRevenue.findMany({
      where: {
        teacherProfileId: teacherProfileId,
        month: month,
        year: year,
        purchase: {
          course: {
            isNot: null,
          },
        },
      },
      include: {
        purchase: {
          include: {
            course: true,
          },
        },
        teacherRank: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedRevenues: FormattedRevenue[] = revenues.map((revenue) => ({
      revenueDate: revenue.createdAt,
      month: revenue.month,
      year: revenue.year,
      amount: revenue.amount,
      revenueTeacherRank: revenue.teacherRank?.name || "N/A",
      revenuePercentage: revenue.teacherRank?.feePercentage || 0,
      course: revenue?.purchase?.course?.title || "N/A",
    }));

    return NextResponse.json(formattedRevenues, { status: 200 });
  } catch (error) {
    console.error("Error fetching revenues", error);
    return NextResponse.json(
      { message: "Failed to fetch monthly revenues" },
      { status: 500 }
    );
  }
}
