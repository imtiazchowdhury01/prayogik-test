// lib/actions/dev-payment.ts
"use server";
 
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import PurchaseEmailService from "@/lib/utils/checkout/mailer";
import {
  createErrorResponse,
  generateRandomPassword,
  generateUsernameFromEmail,
  getAuthenticatedUser,
  handleCertificationCoursePurchase,
  handleEventPurchase,
  handleMembershipPurchase,
  handleOfferPurchase,
  handleSingleCoursePurchase,
  handleTrialPurchase,
} from "@/lib/utils/checkout/server";
import { generateReferralCode } from "@/lib/utils/stringUtils";
import type { Prisma, PurchaseType } from "@prisma/client";
 
const emailService = new PurchaseEmailService();
 
type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    studentProfile: {
      include: {
        subscription: {
          include: {
            subscriptionPlan: true;
          };
        };
      };
    };
  };
}>;
 
interface DevPaymentRequest {
  email: string;
  subscriptionPlanId?: string | null;
  courseId?: string | null;
  certificationId?: string | null;
  amount: number;
  totalAmountTk: number;
  type: PurchaseType;
  eventId?: string | null;
  phoneNumber?: string | null;
  profession?: string | null;
  name?: string | null;
}
 
interface DevPaymentResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
  trxID?: string;
  amount?: number;
}
 
/**
 * Development-only server action to simulate bKash payment flow
 * This bypasses the actual payment gateway and directly processes the purchase
 *
 * @param paymentRequest - Payment request data
 * @returns Payment response with success status and redirect URL
 */
export async function processDevPayment(
  paymentRequest: DevPaymentRequest
): Promise<DevPaymentResponse> {
  // Only allow in development environment
  if (process.env.NODE_ENV === "production") {
    return {
      success: false,
      message: "This action is only available in development mode",
    };
  }
 
  try {
    const {
      email,
      subscriptionPlanId,
      courseId,
      certificationId,
      amount,
      type,
      eventId,
      phoneNumber,
      profession,
      name,
      totalAmountTk,
    } = paymentRequest;
 
    // Validate required fields
    if (!email || !amount || !type) {
      return {
        success: false,
        message: "Missing required fields: email, amount, or type",
      };
    }
 
    // Create purchase history record
    const order = await db.bkashPurchaseHistory.create({
      data: {
        email: email,
        amount: Number(amount),
        subscriptionPlanId: subscriptionPlanId || null,
        courseId: courseId || null,
        certificationId: certificationId || null,
        purchaseType: type,
        eventId: eventId || null,
        phoneNumber: phoneNumber || null,
        profession: profession || null,
        name: name || null,
        bkashPaymentId: `DEV_PAY_${Date.now()}`, // Mock payment ID
      },
    });
 
    // Simulate payment execution result
    const mockExecutePaymentResult = {
      paymentID: order.bkashPaymentId!,
      trxID: `DEV_TRX_${Date.now()}`,
      amount: String(amount),
      statusCode: "0000",
      statusMessage: "Successful",
      payerAccount: phoneNumber || "01700000000",
      customerMsisdn: phoneNumber || "01700000000",
      payerReference: order.id,
      paymentExecuteTime: new Date().toISOString(),
      transactionStatus: "Completed",
    };
 
    // Get or create user
    let user: UserWithProfile | null = null;
    let studentProfile: Prisma.StudentProfileGetPayload<{
      include: {
        subscription: {
          include: {
            subscriptionPlan: true;
          };
        };
      };
    }> | null = null;
    let isNewUser = false;
    let temporaryPassword: string | undefined = undefined;
    let username: string | undefined = undefined;
 
    // Check if user exists by email
    const existingUser = await db.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            subscription: { include: { subscriptionPlan: true } },
          },
        },
      },
    });
 
    if (existingUser) {
      user = existingUser;
      studentProfile = existingUser.studentProfile;
    } else {
      // Create new user
      const randomPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      const generatedUsername = generateUsernameFromEmail(email);
 
      // Generate unique referral code
      let referralCode = await generateReferralCode();
      let existingCode = await db.user.findUnique({
        where: { referralCode },
      });
 
      while (existingCode) {
        referralCode = await generateReferralCode();
        existingCode = await db.user.findUnique({
          where: { referralCode },
        });
      }
 
      user = await db.user.create({
        data: {
          name: name || email.split("@")[0],
          username: generatedUsername,
          email: email,
          password: hashedPassword,
          phoneNumber: phoneNumber || mockExecutePaymentResult.payerAccount,
          profession: profession || null,
          role: "STUDENT",
          emailVerified: true,
          accountStatus: "ACTIVE",
          currentPlan: "NONE",
          referralCode: referralCode,
          studentProfile: {
            create: {},
          },
        },
        include: {
          studentProfile: {
            include: {
              subscription: { include: { subscriptionPlan: true } },
            },
          },
        },
      });
 
      isNewUser = true;
      temporaryPassword = randomPassword;
      username = generatedUsername;
      studentProfile = user.studentProfile;
 
      console.log(
        `[DEV MODE] New user created with email: ${email}, temporary password: ${randomPassword}`
      );
    }
 
    if (!user || !studentProfile) {
      return {
        success: false,
        message: "Unable to create or find user profile",
      };
    }
 
    let purchase = null;
    let subscription = null;
 
    // Handle purchase based on type
    switch (type) {
      case "SINGLE_COURSE": {
        const result = await handleSingleCoursePurchase(
          order,
          studentProfile,
          mockExecutePaymentResult
        );
        if (result instanceof Response) {
          return {
            success: false,
            message: "Error handling single course purchase",
          };
        }
        purchase = result.purchase;
        subscription = result.subscription;
        break;
      }
      case "CERTIFICATION": {
        const result = await handleCertificationCoursePurchase(
          order,
          studentProfile,
          mockExecutePaymentResult
        );
        if (result instanceof Response) {
          return {
            success: false,
            message: "Error handling certification purchase",
          };
        }
        purchase = result.purchase;
        subscription = result.subscription;
        break;
      }
      case "MEMBERSHIP":
      case "SUBSCRIPTION": {
        const result = await handleMembershipPurchase(
          order,
          studentProfile,
          mockExecutePaymentResult
        );
        if (result instanceof Response) {
          return {
            success: false,
            message: "Error handling membership purchase",
          };
        }
        purchase = result.purchase;
        subscription = result.subscription;
        break;
      }
      case "OFFER": {
        const result = await handleOfferPurchase(
          order,
          studentProfile,
          mockExecutePaymentResult
        );
        if (result instanceof Response) {
          return {
            success: false,
            message: "Error handling offer purchase",
          };
        }
        purchase = result.purchase;
        subscription = result.subscription;
        break;
      }
      case "TRIAL": {
        const result = await handleTrialPurchase(order, studentProfile);
        if (result instanceof Response) {
          return {
            success: false,
            message: "Error handling trial purchase",
          };
        }
        purchase = result.purchase;
        subscription = result.subscription;
        break;
      }
      case "EVENT": {
        const result = await handleEventPurchase(
          { ...order, userId: user.id },
          studentProfile
        );
        if (result instanceof Response) {
          return {
            success: false,
            message: "Error handling event purchase",
          };
        }
        purchase = result.purchase;
        subscription = result.subscription;
        break;
      }
      default:
        return {
          success: false,
          message: `Unsupported purchase type: ${type}`,
        };
    }
 
    // Send emails
    await emailService.handlePurchaseEmails(
      { ...order, trxID: mockExecutePaymentResult.trxID },
      purchase,
      subscription,
      user,
      isNewUser,
      temporaryPassword,
      username
    );
 
    console.log(
      `[DEV MODE] Payment processed successfully - TRX: ${mockExecutePaymentResult.trxID}`
    );
 
    return {
      success: true,
      message: "Payment processed successfully (DEV MODE)",
      redirectUrl: `/checkout?trxID=${mockExecutePaymentResult.trxID}&amount=${mockExecutePaymentResult.amount}`,
      trxID: mockExecutePaymentResult.trxID,
      amount: Number(amount),
    };
  } catch (error) {
    console.error("[DEV_PAYMENT_ERROR]", error);
    return {
      success: false,
      message: `Payment processing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}