// app/api/auth/verify-reset-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

interface DecodedToken {
  email: string;
  userId: string;
  purpose: string;
  iat: number;
  exp: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "টোকেন প্রয়োজন।" }, { status: 400 });
    }

    // Verify JWT token
    let decoded: DecodedToken;
    try {
      if (!process.env.JWT_SECRET_KEY) {
        console.error("JWT_SECRET_KEY is not configured");
        return NextResponse.json(
          { error: "সার্ভার কনফিগারেশন সমস্যা।" },
          { status: 500 }
        );
      }

      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as DecodedToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          { error: "টোকেনের মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।" },
          { status: 400 }
        );
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          { error: "ইনভ্যালিড টোকেন।" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "টোকেন ভেরিফিকেশন ব্যর্থ হয়েছে।" },
        { status: 400 }
      );
    }

    // Verify token purpose
    if (decoded.purpose !== "password-reset") {
      return NextResponse.json(
        { error: "ইনভ্যালিড টোকেন টাইপ।" },
        { status: 400 }
      );
    }

    // Find user and verify token
    const user = await db.user.findUnique({
      where: { email: decoded.email },
      select: {
        id: true,
        email: true,
        resetToken: true,
        tokenUsed: true,
        accountStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ইউজার খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Check account status using enum value
    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "আপনার অ্যাকাউন্ট বন্ধ বা স্থগিত করা হয়েছে।" },
        { status: 403 }
      );
    }

    // Check if token exists in database
    if (!user.resetToken || user.resetToken !== token) {
      return NextResponse.json(
        { error: "ইনভ্যালিড বা এক্সপায়ার্ড টোকেন।" },
        { status: 400 }
      );
    }

    // Check if token has already been used
    if (user.tokenUsed === true) {
      return NextResponse.json(
        { error: "এই টোকেন ইতিমধ্যে ব্যবহার করা হয়েছে।" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Token is valid." }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);

    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      { error: "টোকেন ভেরিফিকেশন ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
