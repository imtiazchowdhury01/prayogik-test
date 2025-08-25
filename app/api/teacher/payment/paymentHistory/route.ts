export const dynamic = "force-dynamic";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET API to fetch payment history based on teacherId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    // const teacherProfileId = await useTeacherProfile(userId);

    // Validate teacherId is provided
    if (!teacherId) {
      return NextResponse.json(
        { message: "Teacher Id is required" },
        { status: 400 }
      );
    }

    // Fetching payment history from the database using Prisma
    const paymentHistory =
      (await db.teacherPayments.findMany({
        where: {
          teacherProfileId: teacherId, // Use teacherId as string
        },
        orderBy: {
          createdAt: "desc",
        },
      })) || [];

    // Return payment history as JSON response
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
