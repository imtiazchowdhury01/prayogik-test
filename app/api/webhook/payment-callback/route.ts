import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { PurchaseType } from "@prisma/client";
import nodemailer from "nodemailer";
import { sendSubscriptionCredential } from "@/lib/utils/emailTemplates/sendSubscriptionCredential";
import preparePurchaseDetails from "@/lib/utils/preparePurchaseDetails";
// Types for the callback payload
interface BkashCallbackPayload {
  paymentID: string;
  trxID: string;
  amount: number;
  status: "success" | "failed" | "cancelled";
  intent?: string;
  currency?: string;
  payerReference?: string;
  customerMsisdn?: string;
  type: PurchaseType;
  subscriptionPlanId?: string;
  courseId?: string;
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
        teacherProfile: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

// Enhanced helper function to check course access or subscription access
async function checkCourseAccess(studentProfileId: string, courseId: string) {
  try {
    const activeSubscription = await db.subscription.findFirst({
      where: {
        studentProfileId,
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
      include: {
        subscriptionPlan: true,
      },
    });

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    const directEnrollment = await db.enrolledStudents.findFirst({
      where: { courseId, studentProfileId },
    });

    const result: {
      hasAccess: boolean;
      accessType: "direct_enrollment" | "subscription_access" | null;
      directEnrollment: any | null;
      activeSubscription: any | null;
    } = {
      hasAccess: false,
      accessType: null,
      directEnrollment: null,
      activeSubscription,
    };

    if (directEnrollment) {
      result.hasAccess = true;
      result.accessType = "direct_enrollment";
      result.directEnrollment = directEnrollment;
      return result;
    }

    if (
      activeSubscription &&
      activeSubscription.status === "ACTIVE" &&
      activeSubscription.expiresAt > new Date() &&
      course?.isUnderSubscription
    ) {
      result.hasAccess = true;
      result.accessType = "subscription_access";
    }

    return result;
  } catch (error) {
    console.error("Error checking course access:", error);
    return {
      hasAccess: false,
      accessType: null,
      directEnrollment: null,
      activeSubscription: null,
    };
  }
}

// Purchase handler for SINGLE_COURSE
async function handleSingleCoursePurchase(
  payload: BkashCallbackPayload,
  studentProfile: any
): Promise<{ purchase: any; subscription: null } | NextResponse> {
  if (!payload.courseId) {
    return createErrorResponse(
      "Course ID is required for single course purchase"
    );
  }

  // Check if user already has access to this course
  const courseAccess = await checkCourseAccess(
    studentProfile.id,
    payload.courseId
  );
  console.log(courseAccess, "courseAccess");
  if (courseAccess.hasAccess) {
    const accessMessage =
      courseAccess.accessType === "direct_enrollment"
        ? "previous purchase"
        : "your active subscription";

    return createErrorResponse(
      `You already have access to this course through ${accessMessage}`
    );
  }

  const course = await db.course.findUnique({
    where: { id: payload.courseId },
    include: {
      teacherProfile: true,
      prices: true,
    },
  });

  if (!course) {
    return createErrorResponse("Course not found");
  }

  // Create purchase record
  const purchase = await db.purchase.create({
    data: {
      studentProfileId: studentProfile.id,
      teacherProfileId: course.teacherProfileId,
      courseId: payload.courseId,
      purchaseType: "SINGLE_COURSE",
    },
  });

  // Enroll student in the course
  await db.enrolledStudents.create({
    data: {
      courseId: payload.courseId,
      studentProfileId: studentProfile.id,
    },
  });

  // Update teacher total sales
  await db.teacherProfile.update({
    where: { id: course.teacherProfileId },
    data: { totalSales: { increment: 1 } },
  });

  return { purchase, subscription: null };
}

// Purchase handler for MEMBERSHIP/SUBSCRIPTION
async function handleMembershipPurchase(
  payload: BkashCallbackPayload,
  studentProfile: any
): Promise<{ purchase: any; subscription: any } | NextResponse> {
  if (!payload.subscriptionPlanId) {
    return createErrorResponse(
      "Subscription plan ID is required for membership purchase"
    );
  }

  const subscriptionPlan = await db.subscriptionPlan.findUnique({
    where: { id: payload.subscriptionPlanId },
    include: { subscriptionDiscount: true },
  });

  if (!subscriptionPlan) {
    return createErrorResponse("Subscription plan not found");
  }

  // Check existing subscription for upgrade calculation
  const existingSubscription = await db.subscription.findUnique({
    where: { studentProfileId: studentProfile.id },
  });

  // Calculate expiry date with upgrade logic
  const now = new Date();
  let expiresAt = new Date(now);

  // UPGRADE LOGIC: Add remaining time from current subscription
  if (
    existingSubscription &&
    existingSubscription.status === "ACTIVE" &&
    new Date(existingSubscription.expiresAt) > now
  ) {
    // Calculate remaining time from current subscription
    const remainingTime =
      new Date(existingSubscription.expiresAt).getTime() - now.getTime();
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

    // Start from current expiry date instead of now
    expiresAt = new Date(existingSubscription.expiresAt);

    console.log(
      `Upgrade detected: Adding ${remainingDays} days from current subscription`
    );
  }

  // Add new subscription duration
  if (subscriptionPlan.type === "MONTHLY") {
    expiresAt.setMonth(
      expiresAt.getMonth() + (subscriptionPlan.durationInMonths || 1)
    );
  } else if (subscriptionPlan.type === "YEARLY") {
    expiresAt.setFullYear(
      expiresAt.getFullYear() + (subscriptionPlan.durationInYears || 1)
    );
  }

  // Create purchase record
  const purchase = await db.purchase.create({
    data: {
      studentProfileId: studentProfile.id,
      subscriptionPlanId: payload.subscriptionPlanId,
      purchaseType: payload.type, // MEMBERSHIP or SUBSCRIPTION
      purchaseDuration:
        subscriptionPlan.type === "MONTHLY"
          ? subscriptionPlan.durationInMonths
          : subscriptionPlan.durationInYears,
      expiresAt,
    },
  });

  // Handle trial subscription (NO TRIAL for upgrades/renewals)
  const isSubscriptionHasTrial =
    subscriptionPlan.isTrial && !existingSubscription;
  let trialEndsAt = null;
  let trialStartedAt = null;
  if (isSubscriptionHasTrial) {
    trialStartedAt = new Date();
    trialEndsAt = new Date();
    trialEndsAt.setDate(
      trialEndsAt.getDate() + (subscriptionPlan.trialDurationInDays || 30)
    );
  }

  // Create or update subscription
  let subscription;
  if (existingSubscription) {
    if (
      existingSubscription.subscriptionPlanId === payload.subscriptionPlanId
    ) {
      return createErrorResponse(
        "You already have an active subscription with a different plan. Please cancel it before purchasing a new one."
      );
    }
    subscription = await db.subscription.update({
      where: { studentProfileId: studentProfile.id },
      data: {
        subscriptionPlanId: payload.subscriptionPlanId,
        expiresAt,
        status: "ACTIVE",
        trialStartedAt: null,
        trialEndsAt: null,
      },
    });
  } else {
    subscription = await db.subscription.create({
      data: {
        studentProfileId: studentProfile.id,
        subscriptionPlanId: payload.subscriptionPlanId,
        expiresAt,
        status: "ACTIVE",
        isTrial: payload.type === "TRIAL" ? true : false,
        trialStartedAt: payload.type === "TRIAL" ? trialStartedAt : null,
        trialEndsAt: payload.type === "TRIAL" ? trialEndsAt : null,
      },
    });
  }

  return { purchase, subscription };
}

// Purchase handler for OFFER (subscription + course combo OR course with existing subscription)
async function handleOfferPurchase(
  payload: BkashCallbackPayload,
  studentProfile: any
): Promise<
  { purchase: any; subscription: any; scenario?: string } | NextResponse
> {
  if (!payload.courseId) {
    return createErrorResponse("Course ID is required for offer purchase");
  }

  // Check if user already has access to this course
  const courseAccess = await checkCourseAccess(
    studentProfile.id,
    payload.courseId
  );

  if (courseAccess.hasAccess) {
    const accessMessage =
      courseAccess.accessType === "direct_enrollment"
        ? "previous purchase"
        : "your active subscription";

    return createErrorResponse(
      `You already have access to this course through ${accessMessage}`
    );
  }

  // if (courseAccess.activeSubscription) {
  //   return createErrorResponse(
  //     "You already have an active subscription plan. Please login."
  //   );
  // }

  const course = await db.course.findUnique({
    where: { id: payload.courseId },
    include: {
      teacherProfile: true,
      prices: true,
    },
  });

  if (!course) {
    return createErrorResponse("Course not found");
  }

  // Scenario 1: Both courseId + subscriptionPlanId exist (user wants to buy both)
  if (
    payload.subscriptionPlanId &&
    payload.courseId &&
    !courseAccess.activeSubscription
  ) {
    console.log(courseAccess.activeSubscription, "courseAccess 1212");

    const subscriptionPlan = await db.subscriptionPlan.findUnique({
      where: { id: payload.subscriptionPlanId },
      include: { subscriptionDiscount: true },
    });

    if (!subscriptionPlan) {
      return createErrorResponse("Subscription plan not found");
    }

    // Calculate subscription expiry date
    const now = new Date();
    let expiresAt = new Date(now);
    if (subscriptionPlan.type === "MONTHLY") {
      expiresAt.setMonth(
        expiresAt.getMonth() + (subscriptionPlan.durationInMonths || 1)
      );
    } else if (subscriptionPlan.type === "YEARLY") {
      expiresAt.setFullYear(
        expiresAt.getFullYear() + (subscriptionPlan.durationInYears || 1)
      );
    }

    // Create OFFER purchase record for subscription + course combo
    const purchase = await db.purchase.create({
      data: {
        studentProfileId: studentProfile.id,
        teacherProfileId: course.teacherProfileId,
        subscriptionPlanId: payload.subscriptionPlanId,
        courseId: payload.courseId,
        purchaseType: "OFFER",
        purchaseDuration:
          subscriptionPlan.type === "MONTHLY"
            ? subscriptionPlan.durationInMonths
            : subscriptionPlan.durationInYears,
        expiresAt,
      },
    });

    // Handle subscription part - NO TRIAL ACCESS for OFFER purchases
    const existingSubscription = courseAccess.activeSubscription;
    let subscription;
    if (existingSubscription) {
      subscription = await db.subscription.update({
        where: { studentProfileId: studentProfile.id },
        data: {
          subscriptionPlanId: payload.subscriptionPlanId,
          expiresAt,
          status: "ACTIVE",
          isTrial: false,
          trialStartedAt: null,
          trialEndsAt: null,
        },
      });
    } else {
      subscription = await db.subscription.create({
        data: {
          studentProfileId: studentProfile.id,
          subscriptionPlanId: payload.subscriptionPlanId,
          expiresAt,
          status: "ACTIVE",
          isTrial: false, // No trial for OFFER purchases
          trialStartedAt: null,
          trialEndsAt: null,
        },
      });
    }

    // Enroll student in the course
    await db.enrolledStudents.create({
      data: {
        courseId: payload.courseId,
        studentProfileId: studentProfile.id,
      },
    });

    // Update teacher total sales
    await db.teacherProfile.update({
      where: { id: course.teacherProfileId },
      data: { totalSales: { increment: 1 } },
    });

    return { purchase, subscription, scenario: "subscription_and_course" };
  }

  // Scenario 2: Only courseId exists, subscriptionPlanId (user has existing subscription)
  if (payload.courseId && courseAccess.activeSubscription) {
    // Use the existing subscription from the access check
    const existingSubscription = courseAccess.activeSubscription;
    console.log(courseAccess, "existingSubscription 121211");
    if (!existingSubscription) {
      return createErrorResponse(
        "No active subscription found. Please purchase a subscription first."
      );
    }

    // Create OFFER purchase record for course only (using existing subscription)
    const purchase = await db.purchase.create({
      data: {
        studentProfileId: studentProfile.id,
        teacherProfileId: course.teacherProfileId,
        subscriptionPlanId: existingSubscription.subscriptionPlanId, // Use existing subscription plan
        courseId: payload.courseId,
        purchaseType: "OFFER",
        purchaseDuration: null, // No new subscription duration
        expiresAt: existingSubscription.expiresAt, // Use existing subscription expiry
      },
    });

    // Enroll student in the course
    await db.enrolledStudents.create({
      data: {
        courseId: payload.courseId,
        studentProfileId: studentProfile.id,
      },
    });

    // Update teacher total sales
    await db.teacherProfile.update({
      where: { id: course.teacherProfileId },
      data: { totalSales: { increment: 1 } },
    });

    return {
      purchase,
      subscription: existingSubscription,
      scenario: "course_with_existing_subscription",
    };
  }

  return createErrorResponse("Invalid purchase configuration");
}

// Purchase handler for TRIAL
async function handleTrialPurchase(
  payload: BkashCallbackPayload,
  studentProfile: any
): Promise<{ purchase: any; subscription: any } | NextResponse> {
  if (!payload.subscriptionPlanId) {
    return createErrorResponse(
      "Subscription plan ID is required for trial purchase"
    );
  }

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

// Main POST handler for bKash callback
export async function POST(request: NextRequest) {
  try {
    const payload: BkashCallbackPayload = await request.json();
    console.log("bKash Callback Payload:", payload);

    // Validate required fields
    if (!payload.type) {
      return createErrorResponse("Purchase type is required");
    }

    // For TRIAL purchases, no bKash payment validation needed
    if (payload.type !== "TRIAL") {
      if (!payload.paymentID || !payload.trxID || !payload.amount) {
        return createErrorResponse("Missing required payment fields");
      }

      // Check if payment was successful
      if (payload.status !== "success") {
        // Update BkashManualPayment status to FAILED
        if (payload.paymentID) {
          await db.bkashManualPayment.updateMany({
            where: { trxId: { has: payload.trxID } },
            data: { status: "FAILED" },
          });
        }
        return createErrorResponse(
          `Payment was not successful: ${payload.status}`
        );
      }
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
            phoneNumber:
              payload.userInfo?.phoneNumber || payload.customerMsisdn,
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
        console.log(
          `New user created with email: ${payload.email}, temporary password: ${randomPassword}`
        );
        //---previous
      }
    }

    if (!user || !studentProfile) {
      return createErrorResponse("Unable to create or find user profile", 500);
    }

    // Handle purchase based on type using switch case
    let purchase = null;
    let subscription = null;

    switch (payload.type) {
      case "SINGLE_COURSE": {
        const result = await handleSingleCoursePurchase(
          payload,
          studentProfile
        );
        if (result instanceof NextResponse) return result; // Error response
        purchase = result.purchase;
        subscription = result.subscription;
        break;
      }
      case "MEMBERSHIP":
      case "SUBSCRIPTION": {
        const result = await handleMembershipPurchase(payload, studentProfile);
        if (result instanceof NextResponse) return result; // Error response
        purchase = result.purchase;
        subscription = result.subscription;
        break;
      }
      case "OFFER": {
        const result = await handleOfferPurchase(payload, studentProfile);
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
      default:
        return createErrorResponse(
          `Unsupported purchase type: ${payload.type}`
        );
    }

    // Create purchase history record (skip for TRIAL or if no payment involved)
    if (payload.type !== "TRIAL" && payload.trxID && payload.amount) {
      await db.purchaseHistory.create({
        data: {
          studentProfileId: studentProfile.id,
          transactionId: payload.trxID,
          amount: payload.amount,
          unpaidBalance: 0,
          subscriptionId: subscription?.id,
        },
      });
    }

    //--------new: Send email for new users AFTER purchase processing is complete----
    if (isNewUser && temporaryPassword && username) {
      console.log(`Attempting to send email to new user: ${payload.email}`);
      console.log(
        `isNewUser: ${isNewUser}, temporaryPassword: ${!!temporaryPassword}, username: ${username}`
      );
      try {
        // Get course and subscription plan details for email
        let courseForEmail = null;
        let subscriptionPlanForEmail = null;

        if (payload.courseId) {
          courseForEmail = await db.course.findUnique({
            where: { id: payload.courseId },
            select: { title: true },
          });
          console.log(`Course details:`, courseForEmail);
        }

        if (payload.subscriptionPlanId) {
          subscriptionPlanForEmail = await db.subscriptionPlan.findUnique({
            where: { id: payload.subscriptionPlanId },
            select: { name: true },
          });
          console.log(`Subscription plan details:`, subscriptionPlanForEmail);
        }

        // Prepare purchase details for email template
        const purchaseDetailsForEmail = await preparePurchaseDetails(
          payload,
          purchase,
          subscription,
          courseForEmail,
          subscriptionPlanForEmail
        );
        console.log(`Purchase details for email:`, purchaseDetailsForEmail);

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
        console.log(`Welcome email sent to: ${payload.email}`);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the entire request if email fails
      }
    }

    // Prepare response data
    const responseData = {
      paymentId: payload.paymentID || null,
      transactionId: payload.trxID || null,
      amount: payload.amount || 0,
      purchaseType: payload.type,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      purchase: purchase
        ? {
            id: purchase.id,
            type: purchase.purchaseType,
            expiresAt: purchase.expiresAt,
          }
        : null,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            expiresAt: subscription.expiresAt,
            isTrial: subscription.isTrial,
          }
        : null,
    };

    return createSuccessResponse(
      "Purchase processed successfully",
      responseData
    );
  } catch (error) {
    console.error("bKash callback error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}
