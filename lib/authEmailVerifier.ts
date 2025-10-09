// lib/authEmailVerifier.ts
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

interface DecodedEmailToken {
  email: string;
  userId?: string;
  purpose: string;
  iat: number;
  exp: number;
}

interface VerificationResult {
  success: boolean;
  message: string;
}

export async function authEmailVerifier(
  token: string
): Promise<VerificationResult> {
  try {
    if (!token) {
      return {
        success: false,
        message: "টোকেন প্রয়োজন।",
      };
    }

    // Verify JWT token
    let decoded: DecodedEmailToken;
    try {
      if (!process.env.JWT_SECRET_KEY) {
        console.error("JWT_SECRET_KEY is not configured");
        return {
          success: false,
          message: "সার্ভার কনফিগারেশন সমস্যা।",
        };
      }

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      ) as DecodedEmailToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          success: false,
          message:
            "টোকেনের মেয়াদ শেষ হয়ে গেছে। নতুন ভেরিফিকেশন ইমেইল রিকোয়েস্ট করুন।",
        };
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return {
          success: false,
          message: "ইনভ্যালিড টোকেন।",
        };
      }
      return {
        success: false,
        message: "টোকেন ভেরিফিকেশন ব্যর্থ হয়েছে।",
      };
    }

    // Verify token purpose
    if (decoded.purpose !== "email-verification") {
      return {
        success: false,
        message: "ইনভ্যালিড টোকেন টাইপ।",
      };
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: decoded.email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        emailVerificationToken: true,
        accountStatus: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "ইউজার খুঁজে পাওয়া যায়নি।",
      };
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return {
        success: true,
        message: "ইমেইল ইতিমধ্যে ভেরিফাইড করা আছে।",
      };
    }

    // Verify token matches the one in database
    if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
      return {
        success: false,
        message: "ইনভ্যালিড বা এক্সপায়ার্ড টোকেন।",
      };
    }

    // Check account status
    if (user.accountStatus !== "ACTIVE" && user.accountStatus !== "DEACTIVE") {
      return {
        success: false,
        message: "আপনার অ্যাকাউন্ট সাসপেন্ড বা বন্ধ করা হয়েছে।",
      };
    }

    // Update user - verify email and activate account
    await db.user.update({
      where: { email: decoded.email },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        accountStatus: "ACTIVE", // Activate account upon email verification
      },
    });

    return {
      success: true,
      message: "ইমেইল সফলভাবে ভেরিফাইড হয়েছে। এখন আপনি লগইন করতে পারবেন।",
    };
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

    return {
      success: false,
      message: "ইমেইল ভেরিফিকেশনে সমস্যা হয়েছে।",
    };
  }
}
