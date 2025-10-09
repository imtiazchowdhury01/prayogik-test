"use server";
import { db } from "../db";
import { getOrCreateUser } from "@/services/user";
import { checkEventAccess, createEventRegistration } from "@/services/event";
import PurchaseEmailService from "../utils/checkout/mailer";
import { revalidatePath } from "next/cache";
import { PurchaseType } from "@prisma/client";

interface EventRegistrationData {
  name: string;
  email: string;
  mobile?: string;
  eventId: string;
  facebook?: string;
  linkedin?: string;
}

interface RegistrationResult {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
    userId: string;
    isNewUser?: boolean;
    temporaryPassword?: string;
    username?: string;
  };
  error?: string;
}

export interface UpdateRegistrationStatusResult {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
}

type RegistrationCheckResult = {
  success: boolean;
  isRegistered: boolean;
  isApproved?: boolean;
  message: string;
  canProceed: boolean;
};

// Helper function to call trial subscription API
// async function createUserWithTrialSubscription(
//   registrationData: EventRegistrationData
// ): Promise<{ success: boolean; userData?: any; error?: string }> {
//   try {
//     const trialSubscriptionPlan = await db.subscriptionPlan.findFirst({
//       where: {
//         isTrial: true,
//       },
//     });
//     const trialPayload = {
//       subscriptionPlanId: trialSubscriptionPlan?.id,
//       email: registrationData.email,
//       userInfo: {
//         name: registrationData.name,
//         phoneNumber: registrationData.mobile,
//         facebook: registrationData.facebook,
//         linkedin: registrationData.linkedin,
//       },
//     };

//     // Make internal API call to trial subscription endpoint
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscriptions/purchase/trial`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(trialPayload),
//       }
//     );

//     const result = await response.json();

//     if (!result.success) {
//       return {
//         success: false,
//         error:
//           result.message || "Failed to create user with trial subscription",
//       };
//     }

//     return {
//       success: true,
//       userData: result.data,
//     };
//   } catch (error) {
//     console.error("Error calling trial subscription API:", error);
//     return {
//       success: false,
//       error: "Failed to create user account",
//     };
//   }
// }

const addEventAttendee = async (
  registrationData: EventRegistrationData
): Promise<RegistrationResult> => {
  try {
    const { name, email, mobile, eventId } = registrationData;

    // Validate required fields
    if (!name || !email || !eventId || !mobile) {
      return {
        success: false,
        message: "সব তথ্য পূরণ করা আবশ্যক",
        error: "Missing required fields",
      };
    }

    // Validate email format early
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "সঠিক ইমেইল ঠিকানা প্রদান করুন",
        error: "Invalid email format",
      };
    }

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return {
        success: false,
        message: "ইভেন্টটি খুঁজে পাওয়া যায়নি",
        error: "Event not found",
      };
    }

    // Check if user exists by email
    const existingUser = await getOrCreateUser(email);

    let user: any = existingUser;
    let isNewUser = existingUser.isNewUser;
    let temporaryPassword = existingUser.temporaryPassword;
    let username = existingUser.temporaryPassword;
    const isAlreadyRegistered = await checkEventAccess(user?.id, eventId);
    // Check if user is already registered for this event
    if (existingUser && isAlreadyRegistered) {
      return {
        success: false,
        message: "আপনি ইতিমধ্যে এই ইভেন্টে রেজিস্ট্রেশন করেছেন",
        error: "Already registered",
      };
    }

    // ===================
    // previous code
    // ===================
    // If user doesn't exist, create new user with trial subscription
    // if (!existingUser) {
    //   const trialResult = await createUserWithTrialSubscription(
    //     registrationData
    //   );

    //   if (!trialResult.success) {
    //     return {
    //       success: false,
    //       message: "ব্যবহারকারী তৈরি করতে সমস্যা হয়েছে",
    //       error: trialResult.error || "Failed to create user",
    //     };
    //   }

    //   // Fetch the newly created user
    //   user = await db.user.findUnique({
    //     where: { email },
    //     include: { studentProfile: true },
    //   });

    //   if (!user) {
    //     return {
    //       success: false,
    //       message: "ব্যবহারকারী তৈরি করার পর খুঁজে পাওয়া যায়নি",
    //       error: "User not found after creation",
    //     };
    //   }

    //   isNewUser = true;
    //   // Extract credentials from trial API response if available
    //   if (trialResult.userData) {
    //     temporaryPassword = trialResult.userData.temporaryPassword;
    //     username = trialResult.userData.username;
    //   }

    //   // console.log(`New user created via trial API with email: ${email}`);
    // } else {
    //   // Update existing user's missing information
    //   const userUpdates: {
    //     phoneNumber?: string;
    //     facebook?: string;
    //     linkedin?: string;
    //     name?: string;
    //   } = {};

    //   if (!user.phoneNumber && mobile) {
    //     userUpdates.phoneNumber = mobile;
    //   }

    //   if (!user.name || user.name.trim() === "") {
    //     userUpdates.name = name;
    //   }
    //   if (!user.facebook || user.facebook.trim() === "") {
    //     userUpdates.facebook = registrationData.facebook;
    //   }
    //   if (!user.linkedin || user.linkedin.trim() === "") {
    //     userUpdates.linkedin = registrationData.linkedin;
    //   }

    //   // Update user if needed
    //   if (Object.keys(userUpdates).length > 0) {
    //     user = await db.user.update({
    //       where: { id: user.id },
    //       data: userUpdates,
    //       include: { studentProfile: true },
    //     });
    //   }
    // }

    // Update existing user's missing information
    const userUpdates: {
      phoneNumber?: string;
      facebook?: string;
      linkedin?: string;
      name?: string;
    } = {};

    if (!user.phoneNumber && mobile) {
      userUpdates.phoneNumber = mobile;
    }

    if (!user.name || user.name.trim() === "") {
      userUpdates.name = name;
    }
    if (!user.facebook || user.facebook.trim() === "") {
      userUpdates.facebook = registrationData.facebook;
    }
    if (!user.linkedin || user.linkedin.trim() === "") {
      userUpdates.linkedin = registrationData.linkedin;
    }

    // Update user if needed
    if (Object.keys(userUpdates).length > 0) {
      user = await db.user.update({
        where: { id: user.id },
        data: userUpdates,
        include: { studentProfile: true },
      });
    }

    // Create event registration
    const registration = await createEventRegistration(user?.id, eventId);

    // =======================
    // lead creation commented
    // =======================
    // create a entre in lead table
    // await db.lead.create({
    //   data: {
    //     email,
    //     name,
    //     eventId,
    //     linkedin: registrationData.linkedin,
    //     facebookProfile: registrationData.facebook,
    //     phone: registrationData.mobile,
    //     status: "INTERSTED",
    //   },
    // });

    // Send event registration confirmation email (separate from trial subscription email)
    const emailService = new PurchaseEmailService();
    await emailService.handlePurchaseEmails(
      {
        purchaseType: PurchaseType.EVENT,
        eventId: event.id,
        email,
      },
      null,
      null,
      null,
      isNewUser,
      temporaryPassword,
      username
    );

    const responseData: any = {
      registrationId: registration.id,
      userId: user.id,
    };

    // Include new user information if applicable
    if (isNewUser) {
      responseData.isNewUser = true;
      responseData.temporaryPassword = temporaryPassword;
      responseData.username = username;
    }

    return {
      success: true,
      message: isNewUser
        ? `সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে!`
        : `সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে!`,
      data: responseData,
    };
  } catch (error) {
    console.error("Event registration error:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      // Handle unique constraint violations
      if (
        error.message.includes("Unique constraint") ||
        error.message.includes("P2002")
      ) {
        // Check which field caused the constraint violation
        if (error.message.includes("username")) {
          return {
            success: false,
            message: "এই ইউসারনেম ইতিমধ্যে ব্যবহৃত হয়েছে",
            error: "Username already exists",
          };
        }
        return {
          success: false,
          message: "আপনি ইতিমধ্যে এই ইভেন্টে রেজিস্ট্রেশন করেছেন",
          error: "Already registered",
        };
      }

      // Handle foreign key constraint violations
      if (error.message.includes("P2003")) {
        return {
          success: false,
          message: "অবৈধ ইভেন্ট বা ইউসার তথ্য",
          error: "Invalid reference",
        };
      }

      // Handle connection errors
      if (
        error.message.includes("connection") ||
        error.message.includes("timeout")
      ) {
        return {
          success: false,
          message: "ডাটাবেস সংযোগে সমস্যা। আবার চেষ্টা করুন।",
          error: "Database connection error",
        };
      }
    }

    return {
      success: false,
      message: "রেজিস্ট্রেশনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

async function updateEventRegistrationStatus(
  registrationId: string,
  isApproved: boolean
): Promise<UpdateRegistrationStatusResult> {
  try {
    // Validate input
    if (!registrationId || typeof isApproved !== "boolean") {
      return {
        success: false,
        message: "Invalid input parameters",
        error: "Registration ID and approval status are required",
      };
    }

    // Get the registration with related data
    const existingRegistration = await db.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!existingRegistration) {
      return {
        success: false,
        message: "Registration not found",
        error: "The specified registration does not exist",
      };
    }

    // Check if user has made a purchase for this event
    const userPurchase = await db.purchase.findFirst({
      where: {
        eventId: existingRegistration.eventId,
        studentProfile: {
          userId: existingRegistration.userId,
        },
      },
    });

    // Business rule: Cannot reject users who have already paid
    if (userPurchase && !isApproved) {
      return {
        success: false,
        message: "Cannot reject users who have already paid for the event",
        error: "Paid users cannot be rejected",
      };
    }

    // Update the registration status
    const updatedRegistration = await db.eventRegistration.update({
      where: { id: registrationId },
      data: { isApproved },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            facebook: true,
            linkedin: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/events");

    return {
      success: true,
      message: isApproved
        ? "Registration approved successfully"
        : "Registration rejected successfully",
      data: {
        registration: updatedRegistration,
        previousStatus: existingRegistration.isApproved,
        newStatus: isApproved,
      },
    };
  } catch (error) {
    console.error("Error updating registration status:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("P2025")) {
        return {
          success: false,
          message: "Registration not found",
          error: "Record to update not found",
        };
      }

      if (error.message.includes("P2003")) {
        return {
          success: false,
          message: "Invalid reference",
          error: "Foreign key constraint failed",
        };
      }

      if (
        error.message.includes("connection") ||
        error.message.includes("timeout")
      ) {
        return {
          success: false,
          message: "Database connection error. Please try again.",
          error: "Connection timeout",
        };
      }
    }

    return {
      success: false,
      message: "Failed to update registration status. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkEventRegistration(
  email: string,
  eventId: string
): Promise<RegistrationCheckResult> {
  try {
    // Find user by email
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        success: true,
        isRegistered: false,
        message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি",
        canProceed: true,
      };
    }

    // Get event details to check if it's paid
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        type: true,
        price: true,
      },
    });

    if (!event) {
      return {
        success: false,
        isRegistered: false,
        message: "ইভেন্ট খুঁজে পাওয়া যায়নি",
        canProceed: false,
      };
    }

    // Check if user is already registered for this event
    const existingRegistration = await db.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId,
        },
      },
      select: {
        isApproved: true,
      },
    });

    // Check if user has already paid for this event
    const existingPurchase = await db.purchase.findFirst({
      where: {
        studentProfile: {
          userId: user.id,
        },
        eventId: eventId,
        purchaseType: "EVENT",
      },
      select: {
        id: true,
      },
    });

    const hasPaid = !!existingPurchase;
    const isPaidEvent = event.type === "PAID" && (event.price ?? 0) > 0;

    if (!existingRegistration) {
      return {
        success: true,
        isRegistered: false,
        message: "এই ইভেন্টে আপনি এখনও নিবন্ধিত নন",
        canProceed: true,
      };
    }
    if (existingRegistration && existingPurchase) {
      return {
        success: true,
        isRegistered: true,
        message:
          "আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং পেমেন্ট সম্পন্ন করেছেন।",
        canProceed: false,
      };
    }

    // User is registered, check approval status and payment
    if (existingRegistration.isApproved === false) {
      // If event is paid and user hasn't paid, they can't proceed
      // If user hasn't paid and approval is false, they can't proceed
      const canProceedValue = isPaidEvent ? hasPaid : false;

      return {
        success: true,
        isRegistered: true,
        isApproved: false,
        message:
          "আপনার নিবন্ধন অনুমোদনের অপেক্ষায় রয়েছে। সহায়তার জন্য সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
        canProceed: canProceedValue,
      };
    }

    if (existingRegistration.isApproved === true) {
      // If user is approved but event is paid and they haven't paid, they can still proceed to payment
      const canProceedValue = isPaidEvent ? !hasPaid : false;

      return {
        success: true,
        isRegistered: true,
        isApproved: true,
        message: hasPaid
          ? "আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং পেমেন্ট সম্পন্ন করেছেন।"
          : "আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং অনুমোদিত হয়েছেন।",
        canProceed: canProceedValue,
      };
    }

    // If isApproved is null/undefined (pending)
    // For pending status, user can't proceed regardless of payment
    return {
      success: true,
      isRegistered: true,
      isApproved: undefined,
      message:
        "আপনার নিবন্ধন পর্যালোচনার অধীনে রয়েছে। অনুগ্রহ করে অপেক্ষা করুন।",
      canProceed: false,
    };
  } catch (error) {
    console.error("Error checking event registration:", error);
    return {
      success: false,
      isRegistered: false,
      message:
        "নিবন্ধন যাচাই করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      canProceed: false,
    };
  }
}

export {
  addEventAttendee,
  updateEventRegistrationStatus,
  checkEventRegistration,
};
