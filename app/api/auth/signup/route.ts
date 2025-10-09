// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { accountCreationTemplate } from "@/lib/utils/emailTemplates/account-creation";
import { sendAdminNotification } from "@/lib/utils/emailTemplates/sendAdminNotification";
import { awardInitialSignupCredits } from "@/lib/utils/wallet/initialUserCredits";

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  html: string;
}

function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Create email transporter
function createEmailTransporter() {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_APP_PASS,
    },
  });
}

// Send email function with error handling
async function sendEmail(mailOptions: EmailConfig): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, email, password, referralCode } = body;

    // Validate input
    if (!name || !email || !password) {
      return createErrorResponse("সব ফিল্ড পূরণ করা আবশ্যক");
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return createErrorResponse("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে");
    }

    // Create user with the provided password
    const hashedPassword = await bcrypt.hash(password, 12);
    const username =
      email.split("@")[0] + Math.random().toString(36).substring(2, 7);

    // Start transaction
    const result = await db.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          username,
          emailVerified: true,
          accountStatus: "ACTIVE",
          referralCode: Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase(),
          studentProfile: {
            create: {},
          },
        },
        include: {
          studentProfile: true,
        },
      });

      // Handle referral if code provided
      if (referralCode) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode },
        });

        if (referrer) {
          // Update user with referrer
          await prisma.user.update({
            where: { id: user.id },
            data: { referredByUserId: referrer.id },
          });

          // Create referral record
          await prisma.referral.create({
            data: {
              referrerUserId: referrer.id,
              refereeUserId: user.id,
              referrerType:
                referrer.role === "TEACHER"
                  ? "TEACHER"
                  : referrer.role === "AFFILIATE"
                  ? "AFFILIATE"
                  : "STUDENT",
              program:
                referrer.role === "TEACHER"
                  ? "TEACHER_REF"
                  : referrer.role === "AFFILIATE"
                  ? "AFFILIATE_REF"
                  : "STUDENT_REF",
              referralCode,
              status: "REGISTERED",
              registeredAt: new Date(),
              conversionWindowEndsAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ), // 30 days
              idempotencyKey: `ref_${user.id}_${referrer.id}_${Date.now()}`,
            },
          });
        }
      }

      // Handle trial purchase
      const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
        where: { isTrial: true },
        include: { subscriptionDiscount: true },
      });

      if (!subscriptionPlan) {
        throw new Error("Trial subscription plan not found");
      }

      // Calculate trial dates
      const trialStartedAt = new Date();
      const trialEndsAt = new Date();
      trialEndsAt.setDate(
        trialEndsAt.getDate() + (subscriptionPlan.trialDurationInDays || 30)
      );

      // Create trial purchase
      const purchase = await prisma.purchase.create({
        data: {
          studentProfileId: user.studentProfile!.id,
          subscriptionPlanId: subscriptionPlan.id,
          purchaseType: "TRIAL",
          purchaseDuration: subscriptionPlan.trialDurationInDays || 30,
          expiresAt: trialEndsAt,
          totalAmountTk: 0,
          totalPaidTk: 0,
          paymentStatus: "COMPLETED",
          fullyPaidAt: new Date(),
        },
      });

      // Create trial subscription
      const subscription = await prisma.subscription.create({
        data: {
          studentProfileId: user.studentProfile!.id,
          subscriptionPlanId: subscriptionPlan.id,
          expiresAt: trialEndsAt,
          status: "ACTIVE",
          isTrial: true,
          trialStartedAt,
          trialEndsAt,
        },
      });

      // Create wallet for the user
      const wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          totalCredits: 0,
          availableCredits: 0,
          expiredCredits: 0,
          usedCredits: 0,
          lifetimeEarnedCredits: 0,
        },
      });

      return {
        user,
        purchase,
        subscription,
        username,
        subscriptionPlan,
        wallet,
      };
    });

    // Award initial signup credits (outside transaction to avoid blocking)
    try {
      // await awardInitialSignupCredits(result.user.id, result.wallet.id);
    } catch (error) {
      console.error("Failed to award initial signup credits:", error);
      // Don't fail the signup if credit awarding fails
    }

    // Prepare purchase details for email
    const purchaseDetailsForEmail: any = {
      purchaseType: "TRIAL",
      subscriptionPlanName: result.subscriptionPlan.name,
      isTrial: true,
      expiresAt: result.subscription.expiresAt,
      amount: 0,
      purchaseId: result.purchase.id,
    };

    // Send welcome email to user (non-blocking)
    const userMailOptions: EmailConfig = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: email,
      subject: "প্রয়োগিকে স্বাগতম! আপনার অ্যাকাউন্ট তৈরি হয়েছে।",
      html: accountCreationTemplate(name, email, result.username, password),
    };

    // Send admin notification email (non-blocking)
    const adminMailOptions: EmailConfig = {
      from: `"প্রায়োগিক সিস্টেম" <${process.env.SMTP_USERNAME}>`,
      to: process.env.ADMIN_RECIPIENT_EMAIL || "",
      subject: "প্রায়োগিক - নতুন নিবন্ধন নোটিফিকেশন",
      html: sendAdminNotification(
        email,
        result.username,
        true, // isNewUser - always true for signup
        purchaseDetailsForEmail
      ),
    };

    // Send emails asynchronously without blocking the response
    Promise.all([
      sendEmail(userMailOptions),
      sendEmail(adminMailOptions),
    ]).catch((error) => {
      console.error("Email sending error:", error);
      // Don't throw - let the user signup succeed even if email fails
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully with trial access",
      userId: result.user.id,
    });
  } catch (error: unknown) {
    console.error("Signup error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "সাইনআপ করতে সমস্যা হয়েছে";
    return createErrorResponse(errorMessage, 500);
  }
}