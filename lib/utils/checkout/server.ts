import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { checkEventAccess, createEventRegistration } from "@/services/event";

// Helper function to get course and subscription details
const getEmailResourceDetails = async (payload: any) => {
  const queries = [];

  if (payload.courseId) {
    queries.push(
      db.course.findUnique({
        where: { id: payload.courseId },
        select: { title: true },
      })
    );
  } else {
    queries.push(Promise.resolve(null));
  }

  if (payload.subscriptionPlanId) {
    queries.push(
      db.subscriptionPlan.findUnique({
        where: { id: payload.subscriptionPlanId },
        select: { name: true },
      })
    );
  } else {
    queries.push(Promise.resolve(null));
  }

  const [courseForEmail, subscriptionPlanForEmail] = await Promise.all(queries);
  return { courseForEmail, subscriptionPlanForEmail };
};

// Helper function to send both student and admin emails
const sendEmailNotifications = async (
  transporter: any,
  studentMailOptions: any,
  adminMailOptions: any,
  errorContext: any
) => {
  try {
    await Promise.all([
      transporter.sendMail(studentMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);
  } catch (emailError) {
    console.error(`Failed to send ${errorContext}:`, emailError);
  }
};

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
        studentProfile: {
          include: {
            subscription: {
              include: { subscriptionPlan: true },
            },
          },
        },
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
  studentProfile: any,
  executePaymentResult: any
): Promise<{ purchase: any; subscription: null } | NextResponse> {
  try {
    if (!payload.courseId) {
      return createErrorResponse(
        "Course ID is required for single course purchase"
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
        bkashData: JSON.parse(JSON.stringify(executePaymentResult)),
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
  } catch (error) {
    console.error("Error in handleSingleCoursePurchase:", error);
    return createErrorResponse("Failed to process single course purchase");
  }
}

// Purchase handler for CERTIFICATION
async function handleCertificationCoursePurchase(
  payload: any,
  studentProfile: any,
  executePaymentResult: any
): Promise<{ purchase: any; subscription: null } | NextResponse> {
  try {
    if (!payload.certificationId) {
      return createErrorResponse(
        "Certification ID is required for single course purchase"
      );
    }

    const certification = await db.certification.findUnique({
      where: { id: payload.certificationId },
      include: {
        teacherProfile: true,
        prices: true,
      },
    });

    if (!certification) {
      return createErrorResponse("Certification not found");
    }

    // Create purchase record
    const purchase = await db.purchase.create({
      data: {
        studentProfileId: studentProfile.id,
        teacherProfileId: certification.teacherProfileId,
        certificationId: payload.certificationId,
        purchaseType: "CERTIFICATION",
        bkashData: JSON.parse(JSON.stringify(executePaymentResult)),
      },
    });

    // Enroll student in the course
    await db.enrolledStudents.create({
      data: {
        certificationId: payload.certificationId,
        studentProfileId: studentProfile.id,
      },
    });

    // Update teacher total sales
    await db.teacherProfile.update({
      where: { id: certification.teacherProfileId },
      data: { totalSales: { increment: 1 } },
    });

    return { purchase, subscription: null };
  } catch (error) {
    console.error("Error in handleSingleCoursePurchase:", error);
    return createErrorResponse("Failed to process single course purchase");
  }
}

// Purchase handler for MEMBERSHIP/SUBSCRIPTION
async function handleMembershipPurchase(
  payload: any,
  studentProfile: any,
  executePaymentResult: any
): Promise<{ purchase: any; subscription: any } | NextResponse> {
  try {
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

      // console.log(
      //   `Upgrade detected: Adding ${remainingDays} days from current subscription`
      // );
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
    } else {
      expiresAt.setDate(
        expiresAt.getDate() + (subscriptionPlan.trialDurationInDays || 30)
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
        bkashData: JSON.parse(JSON.stringify(executePaymentResult)),
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
  } catch (error) {
    console.error("Error in handleMembershipPurchase:", error);
    return createErrorResponse("Failed to process membership purchase");
  }
}

// Purchase handler for OFFER (subscription + course combo OR course with existing subscription)
async function handleOfferPurchase(
  payload: any,
  studentProfile: any,
  executePaymentResult: any
): Promise<
  { purchase: any; subscription: any; scenario?: string } | NextResponse
> {
  try {
    if (!payload.courseId) {
      return createErrorResponse("Course ID is required for offer purchase");
    }

    // Check if user already has access to this course
    const courseAccess = await checkCourseAccess(
      studentProfile.id,
      payload.courseId
    );

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
      // console.log(courseAccess.activeSubscription, "courseAccess 1212");

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
          bkashData: JSON.parse(JSON.stringify(executePaymentResult)),
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
      // console.log(courseAccess, "existingSubscription 121211");
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
  } catch (error) {
    console.error("Error in handleOfferPurchase:", error);
    return createErrorResponse("Failed to process offer purchase");
  }
}

// Purchase handler for TRIAL
async function handleTrialPurchase(
  payload: any,
  studentProfile: any
): Promise<{ purchase: any; subscription: any } | NextResponse> {
  try {
    const subscriptionPlan = await db.subscriptionPlan.findFirst({
      where: { isTrial: true },
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
        subscriptionPlanId: subscriptionPlan.id,
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
        subscriptionPlanId: subscriptionPlan.id,
        purchaseType: "TRIAL",
        purchaseDuration: subscriptionPlan.trialDurationInDays || 30,
        expiresAt: trialEndsAt,
      },
    });

    // Create or update subscription with trial access
    const existingSubscription = await db.subscription.findUnique({
      where: { studentProfileId: studentProfile.id, isTrial: true },
    });

    let subscription;
    if (existingSubscription) {
      throw new Error("Already use trial subscription!");
    } else {
      subscription = await db.subscription.create({
        data: {
          studentProfileId: studentProfile.id,
          subscriptionPlanId: subscriptionPlan.id,
          expiresAt: trialEndsAt,
          status: "ACTIVE",
          isTrial: true,
          trialStartedAt,
          trialEndsAt,
        },
      });
    }

    return { purchase, subscription };
  } catch (error) {
    console.error("Error in handleTrialPurchase:", error);
    return createErrorResponse("Failed to process trial purchase");
  }
}

// Event Registration function
async function handleEventPurchase(
  payload: any,
  studentProfile: any
): Promise<{ purchase: any; subscription: any } | NextResponse> {
  try {
    if (!payload.eventId) {
      return createErrorResponse("event ID is required for trial purchase");
    }
    const event = await db.event.findUnique({
      where: { id: payload.eventId },
    });
    let subscription = null;

    if (!event) {
      return createErrorResponse("Event not found");
    }
    // ===============================
    // previous code with trial access
    // ===============================
    // if (!studentProfile?.subscription?.id) {
    //   try {
    //     await handleTrialPurchase(payload, studentProfile);
    //     subscription = await db.subscription.findUnique({
    //       where: { studentProfileId: studentProfile.id },
    //       include: { subscriptionPlan: true },
    //     });
    //   } catch (error) {
    //     console.error("Failed to create trial subscription for event:", error);
    //     return createErrorResponse(
    //       "Failed to create required subscription for event registration"
    //     );
    //   }
    // } else {
    //   subscription = null;
    // }

    const isAlreadyRegistered = await checkEventAccess(
      payload?.userId,
      payload?.eventId
    );

    if (!isAlreadyRegistered) {
      // Create event registration
      await createEventRegistration(payload?.userId, payload?.eventId);
      // create a entre in lead table
      await db.lead.create({
        data: {
          email: payload.email,
          name: payload.name,
          eventId: payload.eventId,
          linkedin: payload.linkedin,
          facebookProfile: payload.facebook,
          phone: payload.phoneNumber,
          status: "INTERSTED",
        },
      });
    }
    // Create trial purchase record
    const purchase = await db.purchase.create({
      data: {
        studentProfileId: studentProfile.id,
        eventId: payload.eventId || "",
        purchaseType: "EVENT",
      },
    });

    return { purchase, subscription };
  } catch (error) {
    console.error("Error in handleEventPurchase:", error);
    return createErrorResponse("Failed to process event purchase");
  }
}

export {
  handleTrialPurchase,
  handleEventPurchase,
  getEmailResourceDetails,
  sendEmailNotifications,
  createSuccessResponse,
  createErrorResponse,
  generateUsernameFromEmail,
  generateRandomPassword,
  verifyAuthToken,
  getAuthenticatedUser,
  checkCourseAccess,
  handleSingleCoursePurchase,
  handleMembershipPurchase,
  handleOfferPurchase,
  handleCertificationCoursePurchase,
};
