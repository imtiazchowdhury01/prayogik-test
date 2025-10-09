// api/bkash/callback/route.ts
import { db } from "@/lib/db";
import { executePayment } from "@/services/bkash";
import { NextResponse, NextRequest } from "next/server";
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
import type { Prisma } from "@prisma/client";

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL!,
  username: process.env.BKASH_CHECKOUT_URL_USER_NAME!,
  password: process.env.BKASH_CHECKOUT_URL_PASSWORD!,
  app_key: process.env.BKASH_CHECKOUT_URL_APP_KEY!,
  app_secret: process.env.BKASH_CHECKOUT_URL_APP_SECRET!,
};

// Create email service instance
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
          let user: UserWithProfile | null = authenticatedUser;
          let studentProfile: Prisma.StudentProfileGetPayload<{
            include: {
              subscription: {
                include: {
                  subscriptionPlan: true;
                };
              };
            };
          }> | null = authenticatedUser?.studentProfile || null;
          let isNewUser = false;
          let temporaryPassword: string | undefined = undefined;
          let username: string | undefined = undefined;

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

              // Generate unique referral code
              let referralCode = await generateReferralCode();

              // Ensure referral code is unique
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
                  name: payload.name || payload.email.split("@")[0],
                  username: generatedUsername,
                  email: payload.email,
                  password: hashedPassword,
                  phoneNumber:
                    payload.phoneNumber ||
                    executePaymentResult?.payerAccount ||
                    null,
                  profession: payload.profession || null,
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
              if (result instanceof NextResponse) return result;
              purchase = result.purchase;
              subscription = result.subscription;
              break;
            }
            case "CERTIFICATION": {
              const result = await handleCertificationCoursePurchase(
                payload,
                studentProfile,
                executePaymentResult
              );
              if (result instanceof NextResponse) return result;
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
              if (result instanceof NextResponse) return result;
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
              if (result instanceof NextResponse) return result;
              purchase = result.purchase;
              subscription = result.subscription;
              break;
            }
            case "TRIAL": {
              const result = await handleTrialPurchase(payload, studentProfile);
              if (result instanceof NextResponse) return result;
              purchase = result.purchase;
              subscription = result.subscription;
              break;
            }
            case "EVENT": {
              const result = await handleEventPurchase(
                { ...payload, userId: user.id },
                studentProfile
              );
              if (result instanceof NextResponse) return result;
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
            { ...payload, trxID: executePaymentResult?.trxID },
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
