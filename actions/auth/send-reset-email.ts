// actions/auth/send-reset-email.ts
"use server";

import nodemailer from "nodemailer";
import { resetEmailTemplate } from "@/lib/utils/emailTemplates/reset-email";

interface EmailResult {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function sendResetEmail(
  email: string,
  resetToken: string
): Promise<EmailResult> {
  try {
    // Validate inputs
    if (!email || !resetToken) {
      return { error: "ইমেইল এবং টোকেন প্রয়োজন" };
    }

    // Validate environment variables
    if (!process.env.SMTP_USERNAME || !process.env.SMTP_APP_PASS) {
      console.error("Missing SMTP credentials");
      return { error: "ইমেইল কনফিগারেশন সমস্যা" };
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error("Missing NEXT_PUBLIC_APP_URL");
      return { error: "অ্যাপ্লিকেশন URL কনফিগার করা নেই" };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      return { error: "ইমেইল সার্ভার সংযোগ ব্যর্থ" };
    }

    // Generate URLs
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const contactUrl = `${process.env.NEXT_PUBLIC_APP_URL}/contact`;

    // Mail options
    const mailOptions = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: email,
      subject: "পাসওয়ার্ড রিসেটের অনুরোধ",
      html: resetEmailTemplate(resetUrl, contactUrl),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Password reset email sent:", {
      messageId: info.messageId,
      to: email,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      message: "ইমেইল সফলভাবে পাঠানো হয়েছে",
    };
  } catch (error) {
    console.error("Error sending reset email:", error);

    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return { error: "ইমেইল পাঠানো ব্যর্থ হয়েছে" };
  }
}
