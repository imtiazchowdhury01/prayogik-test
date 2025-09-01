"use server";

import { db } from "../db";

interface EventRegistrationData {
  name: string;
  email: string;
  mobile?: string;
  profession: string;
  eventId: string;
  userId: string;
}

interface RegistrationResult {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
    userId: string;
  };
  error?: string;
}

const addEventAttendee = async (
  registrationData: EventRegistrationData
): Promise<RegistrationResult> => {
  try {
    const { name, email, mobile, eventId, userId } = registrationData;

    // Validate required fields
    if (!name || !email || !userId || !eventId) {
      return {
        success: false,
        message: "সব তথ্য পূরণ করা আবশ্যক",
        error: "Missing required fields",
      };
    }

    // Validate email format
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

    // Check if user already exists with this email
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "ইউসার খুঁজে পাওয়া যায়নি",
        error: "User not found",
      };
    }

    // Check if user is already registered for this event
    const existingRegistration = await db.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: existingUser.id,
          eventId: eventId,
        },
      },
    });

    if (existingRegistration) {
      return {
        success: false,
        message: "আপনি ইতিমধ্যে এই ইভেন্টে রেজিস্ট্রেশন করেছেন",
        error: "Already registered",
      };
    }

    // Create event registration
    const registration = await db.eventRegistration.create({
      data: {
        userId: existingUser.id,
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
          },
        },
      },
    });

    return {
      success: true,
      message: `সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে!`,
      data: {
        registrationId: registration.id,
        userId: existingUser.id,
      },
    };
  } catch (error) {
    console.error("Event registration error:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return {
          success: false,
          message: "রেজিস্ট্রেশনে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          error: "Constraint violation",
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
