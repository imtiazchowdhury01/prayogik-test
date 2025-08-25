// @ts-nocheck
"use server";

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { resetPasswordTemplate } from "@/lib/utils/emailTemplates/reset-password";
import { sendCredentialTemplate } from "@/lib/utils/emailTemplates/send-credential-template";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function resetPassWord(
  userId: string,
  newPassword: string,
  sendCredentials: boolean
) {
  try {
    const { userId: adminUserId } = await getServerUserSession();

    if (!adminUserId) {
      throw new Error("Not authenticated");
    }

    const isAdmin = await db.user.findUnique({
      where: {
        id: adminUserId,
      },
    });

    if (!isAdmin) {
      throw new Error("You are not an admin");
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHash,
        resetToken: null,
      },
    });

    // if sendCredentials is true then send the credentials to the user
    if (sendCredentials) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_APP_PASS,
        },
      });

      const mailOptions = {
        from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
        to: user?.email,
        subject: "আপনার পাসওয়ার্ড সফলভাবে রিসেট হয়েছে",
        html: resetPasswordTemplate(user?.email, user?.name, newPassword),
      };

      await transporter.sendMail(mailOptions);
    }

    return { message: "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।" };
  }
}
