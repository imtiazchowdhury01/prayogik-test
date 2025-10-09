// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { earningId: string } }
) {
  try {
    const { earningId } = params;

    if (!earningId) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const earning = await db.teacherMonthlyEarnings.findUnique({
      where: {
        id: earningId,
      },
    });

    if (!earning) {
      return NextResponse.json(
        { message: "Earning not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(earning, { status: 200 });
  } catch (error) {
    console.error("Error fetching earning", error);
    return NextResponse.json(
      { message: "Failed to fetch monthly earning" },
      { status: 500 }
    );
  }
}
