// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authEmailVerifier } from "@/lib/authEmailVerifier";

export async function POST(req: NextRequest) {
  try {
    // Get authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "অথরাইজেশন হেডার নেই বা ভুল আছে।",
        },
        { status: 403 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "টোকেন প্রয়োজন।",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { secret } = body;

    // Verify secret if provided
    if (secret) {
      if (!process.env.NEXTAUTH_SECRET) {
        console.error("NEXTAUTH_SECRET is not configured");
        return NextResponse.json(
          {
            success: false,
            message: "সার্ভার কনফিগারেশন সমস্যা।",
          },
          { status: 500 }
        );
      }

      if (secret !== process.env.NEXTAUTH_SECRET) {
        return NextResponse.json(
          {
            success: false,
            message: "ইনভ্যালিড সিক্রেট।",
          },
          { status: 403 }
        );
      }
    }

    // Verify email using the token
    const result = await authEmailVerifier(token);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "ইমেইল ভেরিফিকেশন ব্যর্থ হয়েছে।",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message || "ইমেইল সফলভাবে ভেরিফাইড হয়েছে।",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);

    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "ইমেইল ভেরিফিকেশনে সমস্যা হয়েছে।",
      },
      { status: 500 }
    );
  }
}
