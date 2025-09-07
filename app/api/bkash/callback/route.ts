import { db } from "@/lib/db";
import { executePayment } from "@/services/bkash";
import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import PurchaseEmailService from "@/lib/utils/checkout/mailer";
import {
  createErrorResponse,
  generateRandomPassword,
  generateUsernameFromEmail,
  getAuthenticatedUser,
  getEmailResourceDetails,
  handleEventPurchase,
  handleMembershipPurchase,
  handleOfferPurchase,
  handleSingleCoursePurchase,
  handleTrialPurchase,
} from "@/lib/utils/checkout/server";

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL!,
  username: process.env.BKASH_CHECKOUT_URL_USER_NAME!,
  password: process.env.BKASH_CHECKOUT_URL_PASSWORD!,
  app_key: process.env.BKASH_CHECKOUT_URL_APP_KEY!,
  app_secret: process.env.BKASH_CHECKOUT_URL_APP_SECRET!,
};

// Create email service instance
const emailService = new PurchaseEmailService();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");

    if (!paymentID) {
      return NextResponse.redirect(
        new URL("/checkout?error=No payment ID", req.url)
      );
    }

    if (status === "success") {
      // Execute the payment
      const executePaymentResult = await executePayment(bkashConfig, paymentID);

      if (executePaymentResult && executePaymentResult.statusCode === "0000") {
        // Payload during the payment saved in DB
        const payload = await db.bkashPurchaseHistory.findFirst({
          where: { bkashPaymentId: executePaymentResult.paymentID },
        });

        if (payload) {
          // Get authenticated user (if any)
          const authenticatedUser = await getAuthenticatedUser(req);
          let user: any = authenticatedUser;
          let studentProfile: any = authenticatedUser?.studentProfile;
          let isNewUser = false;
          let temporaryPassword = undefined;
          let username = undefined;

          // Handle unauthenticated users, let them register in our site
          if (!authenticatedUser) {
            if (!payload.email) {
              return createErrorResponse(
                "Email is required for unauthenticated users"
              );
            }

            // Check if user exists by email
            const existingUser = await db.user.findUnique({
              where: { email: payload.email },
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
              const generatedUsername = generateUsernameFromEmail(
                payload.email
              );

              user = await db.user.create({
                data: {
                  name: payload.name || payload.email.split("@")[0],
                  username: username || generatedUsername,
                  email: payload.email,
                  password: hashedPassword,
                  phoneNumber:
                    payload.phoneNumber ||
                    executePaymentResult?.payerAccount ||
                    "",
                  profession: payload.profession || "",
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
              username = generatedUsername;
              studentProfile = user.studentProfile;

              console.log(
                `New user created with email: ${payload.email}, temporary password: ${randomPassword}`
              );
            }
          }

          // User find or Creation failed
          if (!user || !studentProfile) {
            return createErrorResponse(
              "Unable to create or find user profile",
              500
            );
          }

          let purchase = null;
          let subscription = null;

          // Handle purchase based on purchase type
          switch (payload.purchaseType) {
            case "SINGLE_COURSE": {
              const result = await handleSingleCoursePurchase(
                payload,
                studentProfile,
                executePaymentResult
              );
              if (result instanceof NextResponse) return result; // Error response
              purchase = result.purchase;
              subscription = result.subscription;

              break;
            }
            case "MEMBERSHIP":
            case "SUBSCRIPTION": {
              const result = await handleMembershipPurchase(
                payload,
                studentProfile,
                executePaymentResult
              );
              if (result instanceof NextResponse) return result; // Error response
              purchase = result.purchase;
              subscription = result.subscription;
              break;
            }
            case "OFFER": {
              const result = await handleOfferPurchase(
                payload,
                studentProfile,
                executePaymentResult
              );
              if (result instanceof NextResponse) return result; // Error response
              purchase = result.purchase;
              subscription = result.subscription;
              break;
            }
            case "TRIAL": {
              const result = await handleTrialPurchase(payload, studentProfile);
              if (result instanceof NextResponse) return result; // Error response
              purchase = result.purchase;
              subscription = result.subscription;
              break;
            }
            case "EVENT": {
              const result = await handleEventPurchase(
                { ...payload, userId: user.id },
                studentProfile
              );
              if (result instanceof NextResponse) return result; // Error response
              purchase = result.purchase;
              subscription = result.subscription;
              break;
            }
            default:
              return createErrorResponse(
                `Unsupported purchase type: ${payload.purchaseType}`
              );
          }

          await emailService.handlePurchaseEmails(
            payload,
            purchase,
            subscription,
            user,
            isNewUser,
            temporaryPassword,
            username
          );
        }

        return NextResponse.redirect(
          new URL(
            `/checkout?trxID=${executePaymentResult.trxID}&amount=${executePaymentResult.amount}`,
            req.url
          )
        );
      } else {
        return NextResponse.redirect(
          new URL("/checkout?error=Payment execution failed", req.url)
        );
      }
    } else if (status === "failure") {
      return NextResponse.redirect(
        new URL("/checkout?error=Payment cancelled by user", req.url)
      );
    } else if (status === "cancel") {
      return NextResponse.redirect(
        new URL("/checkout?error=Payment canceled", req.url)
      );
    } else {
      return NextResponse.redirect(
        new URL("/checkout?error=Unknown status", req.url)
      );
    }
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/checkout?error=Callback processing failed", req.url)
    );
  }
}

// Handle POST requests as well (some payment gateways send POST)
export async function POST(req: NextRequest) {
  return GET(req);
}

// Create email transporter once (reusable)
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_APP_PASS,
    },
  });
};
