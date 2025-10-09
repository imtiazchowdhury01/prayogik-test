// app/api/referral/validate/route.ts
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ valid: false, error: "No code provided" });
    }

    // Check if referral code exists
    const user = await db.user.findUnique({
      where: { referralCode: code },
    });

    if (!user) {
      return NextResponse.json({
        valid: false,
        error: "Invalid referral code",
      });
    }

    return NextResponse.json({ valid: true, userId: user.id });
  } catch (error) {
    console.error("Error validating referral code:", error);
    return NextResponse.json({ valid: false, error: "Server error" });
  }
}
