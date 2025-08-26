import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { sendCredentialTemplate } from "@/lib/utils/emailTemplates/send-credential-template";
import nodemailer from "nodemailer";
import { sendSubscriptionCredential } from "@/lib/utils/emailTemplates/sendSubscriptionCredential";
import preparePurchaseDetails from "@/lib/utils/preparePurchaseDetails";

// Types for the trial callback payload
interface TrialCallbackPayload {
  subscriptionPlanId: string;
  userId?: string;
  email?: string;
  userInfo?: {
    name?: string;
    phoneNumber?: string;
  };
}

// Generic response interface
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

// Helper function to create success response
function createSuccessResponse<T>(message: string, data: T): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return NextResponse.json(response, { status: 200 });
}

// Helper function to create error response
function createErrorResponse(
  message: string,
  status: number = 400
): NextResponse {
  const response: ApiResponse = {
    success: false,
    message,
    data: null,
  };
  return NextResponse.json(response, { status });
}

// Helper function to generate username from email
function generateUsernameFromEmail(email: string): string {
  const baseUsername = email.split("@")[0];
  const timestamp = Date.now().toString().slice(-4);
  return `${baseUsername}_${timestamp}`;
}

// Helper function to generate random password
function generateRandomPassword(): string {
  return (
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
  );
}

// Helper function to verify JWT token
function verifyAuthToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    return null;
  }
}

// Helper function to get authenticated user
async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return null;

    const decoded = verifyAuthToken(token);
    if (!decoded) return null;

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        studentProfile: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

// Trial purchase handler
async function handleTrialPurchase(
  payload: TrialCallbackPayload,
  studentProfile: any
): Promise<{ purchase: any; subscription: any } | NextResponse> {
  const subscriptionPlan = await db.subscriptionPlan.findUnique({
    where: { id: payload.subscriptionPlanId },
    include: { subscriptionDiscount: true },
  });

  if (!subscriptionPlan) {
    return createErrorResponse("Subscription plan not found");
  }

  if (!subscriptionPlan.isTrial) {
    return createErrorResponse(
      "This subscription plan does not offer trial access"
    );
  }

  // Check if user has already used a trial for this subscription plan
  const existingTrialPurchase = await db.purchase.findFirst({
    where: {
      studentProfileId: studentProfile.id,
      subscriptionPlanId: payload.subscriptionPlanId,
      purchaseType: "TRIAL",
    },
  });

  if (existingTrialPurchase) {
    return createErrorResponse(
      "You have already used a trial for this subscription plan"
    );
  }

  // Calculate trial dates
  const trialStartedAt = new Date();
  const trialEndsAt = new Date();
  trialEndsAt.setDate(
    trialEndsAt.getDate() + (subscriptionPlan.trialDurationInDays || 30)
  );

  // Create trial purchase record
  const purchase = await db.purchase.create({
    data: {
      studentProfileId: studentProfile.id,
      subscriptionPlanId: payload.subscriptionPlanId,
      purchaseType: "TRIAL",
      purchaseDuration: subscriptionPlan.trialDurationInDays || 30,
      expiresAt: trialEndsAt,
    },
  });

  // Create or update subscription with trial access
  const existingSubscription = await db.subscription.findUnique({
    where: { studentProfileId: studentProfile.id },
  });

  let subscription;
  if (existingSubscription) {
    subscription = await db.subscription.update({
      where: { studentProfileId: studentProfile.id },
      data: {
        subscriptionPlanId: payload.subscriptionPlanId,
        expiresAt: trialEndsAt,
        status: "ACTIVE",
        isTrial: true,
        trialStartedAt,
        trialEndsAt,
      },
    });
  } else {
    subscription = await db.subscription.create({
      data: {
        studentProfileId: studentProfile.id,
        subscriptionPlanId: payload.subscriptionPlanId,
        expiresAt: trialEndsAt,
        status: "ACTIVE",
        isTrial: true,
        trialStartedAt,
        trialEndsAt,
      },
    });
  }

  return { purchase, subscription };
}

// Main POST handler for trial subscription
export async function POST(request: NextRequest) {
  try {
    const payload: TrialCallbackPayload = await request.json();
    // console.log("Trial Subscription Payload:", payload);

    // Validate required fields
    if (!payload.subscriptionPlanId) {
      return createErrorResponse("Subscription plan ID is required");
    }

    // Get authenticated user (if any)
    const authenticatedUser = await getAuthenticatedUser(request);
    let user: any = authenticatedUser;
    let studentProfile = authenticatedUser?.studentProfile;
    let isNewUser = false;
    let temporaryPassword = null;
    let username = null;

    // Handle unauthenticated users
    if (!authenticatedUser) {
      if (!payload.email) {
        return createErrorResponse(
          "Email is required for unauthenticated users"
        );
      }

      // Check if user exists by email
      const existingUser = await db.user.findUnique({
        where: { email: payload.email },
        include: { studentProfile: true },
      });

      if (existingUser) {
        user = existingUser;
        studentProfile = existingUser.studentProfile;
      } else {
        // Create new user
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 12);
        const generatedUsername = generateUsernameFromEmail(payload.email);

        user = await db.user.create({
          data: {
            name: payload.userInfo?.name || payload.email.split("@")[0],
            username: username || generatedUsername,
            email: payload.email,
            password: hashedPassword,
            phoneNumber: payload.userInfo?.phoneNumber,
            role: "STUDENT",
            emailVerified: true,
            accountStatus: "ACTIVE",
            studentProfile: {
              create: {},
            },
          },
          include: { studentProfile: true },
        });
        isNewUser = true;
        temporaryPassword = randomPassword;
        username = generatedUsername; // Assign to the outer scope variable; // Assign to the outer scope variable
        studentProfile = user.studentProfile;
        // console.log(
        //   `New user created with email: ${payload.email}, temporary password: ${randomPassword}`
        // );
      }
    }

    if (!user || !studentProfile) {
      return createErrorResponse("Unable to create or find user profile", 500);
    }

    // Handle trial purchase
    const result = await handleTrialPurchase(payload, studentProfile);
    if (result instanceof NextResponse) return result; // Error response

    const { purchase, subscription } = result;

    //--------Send email for new users AFTER purchase----
    if (isNewUser && temporaryPassword && username) {
      try {
        // Get course and subscription plan details for email
        let courseForEmail = null;
        let subscriptionPlanForEmail = null;

        if (payload.subscriptionPlanId) {
          subscriptionPlanForEmail = await db.subscriptionPlan.findUnique({
            where: { id: payload.subscriptionPlanId },
            select: { name: true },
          });
        }

        // Prepare purchase details for email template
        const purchaseDetailsForEmail = await preparePurchaseDetails(
          payload,
          purchase,
          subscription,
          courseForEmail,
          subscriptionPlanForEmail
        );
        // console.log(`Purchase details for email:`, purchaseDetailsForEmail);
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_APP_PASS,
          },
        });

        const mailOptions = {
          from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
          to: payload?.email,
          subject:
            "প্রয়োগিকে স্বাগতম! আপনার পেমেন্ট সফল হয়েছে এবং অ্যাকাউন্ট তৈরি হয়েছে।",
          html: sendSubscriptionCredential(
            payload.email,
            username,
            temporaryPassword,
            purchaseDetailsForEmail
          ),
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    // Prepare response data
    const responseData = {
      purchaseType: "TRIAL",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      purchase: {
        id: purchase.id,
        type: purchase.purchaseType,
        expiresAt: purchase.expiresAt,
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        expiresAt: subscription.expiresAt,
        isTrial: subscription.isTrial,
        trialStartedAt: subscription.trialStartedAt,
        trialEndsAt: subscription.trialEndsAt,
      },
    };

    return createSuccessResponse(
      "Trial subscription activated successfully",
      responseData
    );
  } catch (error) {
    console.error("Trial subscription error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}
