// @ts-nocheck
"use server";

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { resetPasswordTemplate } from "@/lib/utils/emailTemplates/reset-password";
import { sendCredentialTemplate } from "@/lib/utils/emailTemplates/send-credential-template";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function resetProfilePassWord(
  oldPassword: string,
  newPassword: string
) {
  try {
    const { userId } = await getServerUserSession();

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("আপনার দেওয়া পুরনো পাসওয়ার্ড ভুল হয়েছে।");
    }

    // Verify new password is same as old
    const isMatchNewPassAsOld = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isMatchNewPassAsOld) {
      throw new Error("New password is same as old password!");
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHash,
        resetToken: null,
      },
    });

    return { message: "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: error?.message || "Failed to reset password." };
  }
}


