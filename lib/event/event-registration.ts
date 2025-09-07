"use server";
import { db } from "../db";
import nodemailer from "nodemailer";
import { sendEventRegistrationEmail } from "../utils/emailTemplates/event-registration-template";

interface EventRegistrationData {
  name: string;
  email: string;
  mobile?: string;
  profession: string;
  eventId: string;
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

// Helper function to call trial subscription API
async function createUserWithTrialSubscription(
  registrationData: EventRegistrationData
): Promise<{ success: boolean; userData?: any; error?: string }> {
  try {
    const trialSubscriptionPlan = await db.subscriptionPlan.findFirst({
      where: {
        isTrial: true,
      },
    });
    const trialPayload = {
      subscriptionPlanId: trialSubscriptionPlan?.id,
      email: registrationData.email,
      userInfo: {
        name: registrationData.name,
        phoneNumber: registrationData.mobile,
      },
    };

    // Make internal API call to trial subscription endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscriptions/purchase/trial`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trialPayload),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error:
          result.message || "Failed to create user with trial subscription",
      };
    }

    return {
      success: true,
      userData: result.data,
    };
  } catch (error) {
    console.error("Error calling trial subscription API:", error);
    return {
      success: false,
      error: "Failed to create user account",
    };
  }
}

const addEventAttendee = async (
  registrationData: EventRegistrationData
): Promise<RegistrationResult> => {
  try {
    const { name, email, mobile, profession, eventId } = registrationData;

    // Validate required fields
    if (!name || !email || !eventId || !mobile || !profession) {
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
    const existingUser = await db.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        eventRegistrations: {
          where: { eventId },
        },
      },
    });

    let user: any = existingUser;
    let isNewUser = false;
    let temporaryPassword: string | null = null;
    let username: string | null = null;

    // Check if user is already registered for this event
    if (existingUser && existingUser.eventRegistrations.length > 0) {
      return {
        success: false,
        message: "আপনি ইতিমধ্যে এই ইভেন্টে রেজিস্ট্রেশন করেছেন",
        error: "Already registered",
      };
    }

    // If user doesn't exist, create new user with trial subscription
    if (!existingUser) {
      const trialResult = await createUserWithTrialSubscription(
        registrationData
      );

      if (!trialResult.success) {
        return {
          success: false,
          message: "ব্যবহারকারী তৈরি করতে সমস্যা হয়েছে",
          error: trialResult.error || "Failed to create user",
        };
      }

      // Fetch the newly created user
      user = await db.user.findUnique({
        where: { email },
        include: { studentProfile: true },
      });

      if (!user) {
        return {
          success: false,
          message: "ব্যবহারকারী তৈরি করার পর খুঁজে পাওয়া যায়নি",
          error: "User not found after creation",
        };
      }

      isNewUser = true;
      // Extract credentials from trial API response if available
      if (trialResult.userData) {
        temporaryPassword = trialResult.userData.temporaryPassword;
        username = trialResult.userData.username;
      }

      console.log(`New user created via trial API with email: ${email}`);
    } else {
      // Update existing user's missing information
      const userUpdates: {
        phoneNumber?: string;
        profession?: string;
        name?: string;
      } = {};

      if (!user.phoneNumber && mobile) {
        userUpdates.phoneNumber = mobile;
      }
      if (!user.profession && profession) {
        userUpdates.profession = profession;
      }
      if (!user.name || user.name.trim() === "") {
        userUpdates.name = name;
      }

      // Update user if needed
      if (Object.keys(userUpdates).length > 0) {
        user = await db.user.update({
          where: { id: user.id },
          data: userUpdates,
          include: { studentProfile: true },
        });
      }
    }

    // Create event registration
    const registration = await db.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: eventId,
      },
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
            date: true,
            type: true,
            price: true,
            isOnline: true,
            location: true,
            zoomLink: true,
          },
        },
      },
    });

    // Send event registration confirmation email (separate from trial subscription email)
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_APP_PASS,
        },
      });

      const emailSubject = `ইভেন্ট রেজিস্ট্রেশন নিশ্চিতকরণ - ${event.title}`;
      const emailContent = sendEventRegistrationEmail(
        email,
        username,
        temporaryPassword,
        event,
        isNewUser
      );

      const mailOptions = {
        from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
        to: email,
        subject: emailSubject,
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);

      console.log(`Event registration email sent to: ${email}`);
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      // Note: We don't fail the registration if email fails
    }

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

export { addEventAttendee };
