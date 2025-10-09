// app/api/referrals/send-invitation/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { referralInvitationTemplate } from "@/lib/utils/emailTemplates/referral-invitation-template";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Get the current user session
    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const { email, referralCode } = await req.json();

    if (!email || !referralCode) {
      return NextResponse.json(
        { error: "Email and referral code are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const referralLink = `${baseUrl}/signup?ref=${referralCode}`;

    // Generate email HTML
    const emailHtml = referralInvitationTemplate(
      user?.name as string,
      referralLink,
      baseUrl as string
    );

    // Send email
    const mailOptions = {
      from: `"প্রয়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: email,
      subject: `${user?.name} আপনাকে প্রয়োগিক প্ল্যাটফর্মে আমন্ত্রণ জানিয়েছেন!`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: "Invitation sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending referral invitation:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
