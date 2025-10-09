// lib/utils/password-utils.ts
import { db } from "@/lib/db";

/**
 * Clean up expired reset tokens
 * Run this as a cron job daily
 */
export async function cleanupExpiredResetTokens() {
  try {
    const result = await db.user.updateMany({
      where: {
        resetToken: {
          not: null,
        },
        // Tokens older than 24 hours
        updatedAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      data: {
        resetToken: null,
        tokenUsed: null,
      },
    });

    console.log(`Cleaned up ${result.count} expired reset tokens`);
    return result;
  } catch (error) {
    console.error("Error cleaning up reset tokens:", error);
    throw error;
  }
}

/**
 * Check if user has too many recent password reset requests
 * Prevents abuse
 */
export async function checkResetRateLimit(
  email: string,
  maxRequests: number = 5,
  windowMinutes: number = 60
): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        updatedAt: true,
        resetToken: true,
      },
    });

    if (!user) {
      return true; // Allow request if user not found
    }

    // Check if there's a recent reset token update
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    if (user.updatedAt && user.updatedAt > windowStart && user.resetToken) {
      // User has requested reset within the window
      // For now, we'll just allow one request per hour
      // You can extend this with a separate rate limiting table
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return true; // Allow on error
  }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
  }

  if (password.length > 128) {
    errors.push("পাসওয়ার্ড সর্বোচ্চ ১২৮ অক্ষরের হতে পারে");
  }

  // Optional: Add more validation rules
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if account is eligible for password reset
 */
export async function isAccountEligibleForReset(
  email: string
): Promise<{ eligible: boolean; reason?: string }> {
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        accountStatus: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return { eligible: false, reason: "User not found" };
    }

    if (user.accountStatus !== "ACTIVE") {
      return {
        eligible: false,
        reason: "অ্যাকাউন্ট বন্ধ বা স্থগিত করা হয়েছে",
      };
    }

    if (!user.emailVerified) {
      return {
        eligible: false,
        reason: "ইমেইল ভেরিফাইড হয়নি",
      };
    }

    return { eligible: true };
  } catch (error) {
    console.error("Error checking account eligibility:", error);
    return { eligible: false, reason: "System error" };
  }
}
