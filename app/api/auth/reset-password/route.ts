// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "@/actions/auth/send-reset-email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে ইমেইল প্রদান করুন" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে সঠিক ইমেইল প্রদান করুন" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        accountStatus: true,
        emailVerified: true,
      },
    });

    if (!user) {
      // Return success message even if user not found (security best practice)
      return NextResponse.json(
        {
          message:
            "পাসওয়ার্ড রিসেটের ইমেইল পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স পরীক্ষা করুন।",
        },
        { status: 200 }
      );
    }

    // Check account status using enum
    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          error:
            "আপনার অ্যাকাউন্ট বন্ধ বা সাময়িকভাবে স্থগিত করা হয়েছে। সাপর্টে যোগাযোগ করুন।",
        },
        { status: 403 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "আপনার ইমেইল এখনও ভেরিফাইড হয়নি।" },
        { status: 403 }
      );
    }

    // Generate reset token
    const resetToken = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    // Update user with reset token and mark tokenUsed as false
    await db.user.update({
      where: { email },
      data: {
        resetToken,
        tokenUsed: false,
      },
    });

    // Send reset email
    const result = await sendResetEmail(email, resetToken);

    if (result?.error || !result?.success) {
      return NextResponse.json(
        {
          error:
            result?.error || "পাসওয়ার্ড রিসেটের ইমেইল পাঠাতে ব্যর্থ হয়েছে।",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "পাসওয়ার্ড রিসেটের ইমেইল পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স পরীক্ষা করুন।",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during password reset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
