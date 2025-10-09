// api/teacher/payment/paymentHistory/route.ts
export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherProfileId = searchParams.get("teacherProfileId");

    if (!teacherProfileId) {
      return NextResponse.json(
        { message: "Teacher Profile ID is required" },
        { status: 400 }
      );
    }

    const paymentHistory = await db.teacherPayments.findMany({
      where: {
        teacherProfileId: teacherProfileId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(paymentHistory);
  } catch (error: any) {
    console.error(
      "Error fetching payment history:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
