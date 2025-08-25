// @ts-nocheck

import { resetEmailTemplate } from "@/lib/utils/emailTemplates/reset-email";
import nodemailer from "nodemailer";

export async function sendResetEmail(email, resetToken) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const contactUrl = `${process.env.NEXT_PUBLIC_APP_URL}/contact`;

    const mailOptions = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: email,
      subject: "পাসওয়ার্ড রিসেটের অনুরোধ",
      html: resetEmailTemplate(resetUrl, contactUrl),
    };

    await transporter.sendMail(mailOptions);
    return { message: "ইমেইল সফলভাবে পাঠানো হয়েছে" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "ইমেইল পাঠানো ব্যর্থ হয়েছে" };
  }
}
