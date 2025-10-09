// api/auth/addteacher/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  generateUsername,
  generateReferralCode,
} from "@/lib/utils/stringUtils";
import nodemailer from "nodemailer";
import { accountCreationTemplate } from "@/lib/utils/emailTemplates/account-creation";

export async function POST(req: NextRequest) {
  const { name, email, password, teacherRankId, sendCredentials } =
    await req.json();

  if (!name || !email || !password || !teacherRankId) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "ব্যবহারকারী ইতোমধ্যে রয়েছে" },
        { status: 400 }
      );
    }

    // Verify teacher rank exists
    const teacherRank = await db.teacherRank.findUnique({
      where: { id: teacherRankId },
    });

    if (!teacherRank) {
      return NextResponse.json(
        { error: "Invalid teacher rank ID" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique username
    let username = generateUsername(name);
    let usernameExists = await db.user.findUnique({
      where: { username },
    });

    while (usernameExists) {
      username = generateUsername(name);
      usernameExists = await db.user.findUnique({
        where: { username },
      });
    }

    // Generate unique referral code
    let referralCode = await generateReferralCode();
    let codeExists = await db.user.findUnique({
      where: { referralCode },
    });

    while (codeExists) {
      referralCode = await generateReferralCode();
      codeExists = await db.user.findUnique({
        where: { referralCode },
      });
    }

    // Create user with student and teacher profiles in a transaction
    const newUser = await db.user.create({
      data: {
        name,
        email,
        username,
        password: passwordHash,
        emailVerified: true,
        emailVerificationToken: token,
        tokenUsed: true,
        role: "TEACHER",
        accountStatus: "ACTIVE",
        currentPlan: "NONE",
        referralCode,
        studentProfile: {
          create: {},
        },
        teacherProfile: {
          create: {
            teacherRankId,
            teacherStatus: "VERIFIED",
            totalSales: 0,
          },
        },
        wallet: {
          create: {
            totalCredits: 0,
            availableCredits: 0,
            expiredCredits: 0,
            usedCredits: 0,
            lifetimeEarnedCredits: 0,
          },
        },
      },
    });

    // Send credentials email if requested
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
        to: email,
        subject: "প্রয়োগিকে স্বাগতম! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
        html: accountCreationTemplate(name, email, username, password),
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json(
      { message: "সফলভাবে তৈরি হয়েছে!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during teacher creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
