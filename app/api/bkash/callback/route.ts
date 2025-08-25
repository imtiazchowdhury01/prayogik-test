import { db } from "@/lib/db";
import { executePayment } from "@/services/bkash";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { sendCredentialTemplate } from "@/lib/utils/emailTemplates/send-credential-template";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL!,
  username: process.env.BKASH_CHECKOUT_URL_USER_NAME!,
  password: process.env.BKASH_CHECKOUT_URL_PASSWORD!,
  app_key: process.env.BKASH_CHECKOUT_URL_APP_KEY!,
  app_secret: process.env.BKASH_CHECKOUT_URL_APP_SECRET!,
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");

    console.log("Callback received:", { paymentID, status });

    if (!paymentID) {
      return NextResponse.redirect(
        new URL("/checkout?error=No payment ID", req.url)
      );
    }

    if (status === "success") {
      // Execute the payment
      const executePaymentResult = await executePayment(bkashConfig, paymentID);

      console.log("Execute payment result:", executePaymentResult);

      if (executePaymentResult && executePaymentResult.statusCode === "0000") {
        // Payment successful

        // Payload during the payment saved in DB
        const payload = await db.bkashPurchaseHistory.findFirst({
          where: { bkashPaymentId: executePaymentResult.paymentID },
        });

        if (payload) {
          // Get authenticated user (if any)
          const authenticatedUser = await getAuthenticatedUser(req);
          let user: any = authenticatedUser;
          let studentProfile = authenticatedUser?.studentProfile;

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
              include: { studentProfile: true },
            });

            if (existingUser) {
              user = existingUser;
              studentProfile = existingUser.studentProfile;
            } else {
              // Create new user
              const randomPassword = generateRandomPassword();
              const hashedPassword = await bcrypt.hash(randomPassword, 12);
              const username = generateUsernameFromEmail(payload.email);

              user = await db.user.create({
                data: {
                  name: payload.email.split("@")[0],
                  username,
                  email: payload.email,
                  password: hashedPassword,
                  phoneNumber: executePaymentResult?.payerAccount || "",
                  role: "STUDENT",
                  emailVerified: true,
                  accountStatus: "ACTIVE",
                  studentProfile: {
                    create: {},
                  },
                },
                include: { studentProfile: true },
              });

              studentProfile = user.studentProfile;
              console.log(
                `New user created with email: ${payload.email}, temporary password: ${randomPassword}`
              );
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
                subject: "প্রয়োগিকে স্বাগতম! আপনার অ্যাকাউন্ট তৈরি হয়েছে।",
                html: sendCredentialTemplate(
                  payload.email,
                  username,
                  randomPassword
                ),
              };

              await transporter.sendMail(mailOptions);
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
                studentProfile
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
                studentProfile
              );
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
                `Unsupported purchase type: ${payload.purchaseType}`
              );
          }

          console.log("Purchase after payment Success:", purchase);
          console.log("subscription after payment Success:", subscription);
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
      return NextResponse.redirect(new URL("/checkout?error=Payment canceled", req.url));
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

// Helper function to create success response
function createSuccessResponse<T>(message: string, data: T): NextResponse {
  const response: any = {
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
  const response: any = {
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
  payload: any,
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
  payload: any,
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
      purchaseType: payload.purchaseType, // MEMBERSHIP or SUBSCRIPTION
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
        isTrial: payload.purchaseType === "TRIAL" ? true : false,
        trialStartedAt:
          payload.purchaseType === "TRIAL" ? trialStartedAt : null,
        trialEndsAt: payload.purchaseType === "TRIAL" ? trialEndsAt : null,
      },
    });
  }

  return { purchase, subscription };
}

// Purchase handler for OFFER (subscription + course combo OR course with existing subscription)
async function handleOfferPurchase(
  payload: any,
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
  payload: any,
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
