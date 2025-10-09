// api/admin/teachers/payments/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { isAdmin } = await getServerUserSession();

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { teacherProfileId } = body as { teacherProfileId: string };

    if (!teacherProfileId) {
      return NextResponse.json(
        { message: "Teacher Profile ID is required" },
        { status: 400 }
      );
    }

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

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error fetching monthly earnings:", error);
    return NextResponse.json(
      { message: "Failed to fetch monthly earnings" },
      { status: 500 }
    );
  }
}
