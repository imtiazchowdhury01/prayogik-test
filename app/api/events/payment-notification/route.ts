// api/events/payment-notification/route.ts
import { paymentReminderTemplate } from "@/lib/utils/emailTemplates/payment-reminder-template";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { EventType } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface EventDetails {
  title: string;
  type?: EventType;
  slug?: string;
  date?: Date;
  location?: string;
  isOnline?: boolean;
  price?: number;
  zoomLink?: string;
}

interface AttendeeUser {
  name?: string;
  email: string;
}

interface Attendee {
  user: AttendeeUser;
  event?: EventDetails;
}

interface NotificationRequest {
  attendees: Attendee[];
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface ErrorResponse {
  message: string;
}

// ========== POST HANDLER ==========

export async function POST(
  req: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body: NotificationRequest = await req.json();
    const { attendees } = body;

    if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
      return NextResponse.json(
        { message: "কোনো প্রাপক পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    // Validate email configuration
    if (!process.env.SMTP_USERNAME || !process.env.SMTP_APP_PASS) {
      return NextResponse.json(
        { message: "SMTP configuration is missing" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    // Send emails to all attendees
    const emailPromises = attendees.map(async (attendee) => {
      if (!attendee.user?.email) {
        console.error("Attendee missing email:", attendee);
        return Promise.resolve();
      }

      // Skip if event or required fields are missing
      if (!attendee.event?.slug) {
        console.error("Attendee missing event slug:", attendee);
        return Promise.resolve();
      }

      const eventDetails = {
        title: attendee.event.title || "ইভেন্ট",
        slug: attendee.event.slug, // Now guaranteed to be a string
        type: attendee.event.type,
        date: attendee.event.date?.toISOString(),
        location: attendee.event.location,
        isOnline: attendee.event.isOnline,
        price: attendee.event.price,
        zoomLink: attendee.event.zoomLink,
      };

      const isFreeEvent = eventDetails.type === "FREE";

      const emailHtml = paymentReminderTemplate(
        attendee.user.name || "অংশগ্রহণকারী",
        eventDetails,
        baseUrl
      );

      const emailSubject = isFreeEvent
        ? `প্রায়োগিক - ইভেন্ট রেজিস্ট্রেশন নিশ্চিতকরণ: ${eventDetails.title}`
        : `প্রায়োগিক - ইভেন্ট পেমেন্ট রিমাইন্ডার: ${eventDetails.title}`;

      const mailOptions = {
        from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
        to: attendee.user.email,
        subject: emailSubject,
        html: emailHtml,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    // Determine success message
    const hasAnyFreeEvent = attendees.some(
      (attendee) => attendee.event?.type === "FREE"
    );
    const hasAnyPaidEvent = attendees.some(
      (attendee) => attendee.event?.type === "PAID"
    );

    let successMessage = "";
    if (hasAnyFreeEvent && hasAnyPaidEvent) {
      successMessage = `${attendees.length} জন অংশগ্রহণকারীকে নোটিফিকেশন পাঠানো হয়েছে।`;
    } else if (hasAnyFreeEvent) {
      successMessage = `${attendees.length} জন অংশগ্রহণকারীকে রেজিস্ট্রেশন নিশ্চিতকরণ পাঠানো হয়েছে।`;
    } else {
      successMessage = `${attendees.length} জন অংশগ্রহণকারীকে পেমেন্ট রিমাইন্ডার পাঠানো হয়েছে।`;
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("[PAYMENT_NOTIFICATION_ERROR]", error);
    return NextResponse.json(
      { message: "ইমেল পাঠাতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
