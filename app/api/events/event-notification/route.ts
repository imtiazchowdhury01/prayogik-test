// /api/events/event-notification/route.ts
import { EventreminderToAttendeeTemplate } from "@/lib/utils/emailTemplates/event-reminder-to-attendee-template";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { attendees } = await req.json();

    if (!attendees || attendees.length === 0) {
      return NextResponse.json(
        { message: "কোনো প্রাপক পাওয়া যায়নি।" },
        { status: 400 }
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
    const emailPromises = attendees.map(async (attendee: any) => {
      // Extract event details from the attendee object
      const eventDetails = {
        title: attendee.event?.title || "ইভেন্ট",
        type: attendee.event?.type,
        slug: attendee.event?.slug,
        date: attendee.event?.date,
        location: attendee.event?.location,
        isOnline: attendee.event?.isOnline,
        price: attendee.event?.price,
        zoomLink: attendee.event?.zoomLink
      };

      const isFreeEvent = eventDetails.type === "FREE";
      const isPaidEvent = eventDetails.type === "PAID";

      // Generate appropriate email template based on event type
      const emailHtml = EventreminderToAttendeeTemplate(
        attendee.user?.name || "অংশগ্রহণকারী",
        eventDetails,
        baseUrl
      );

      // Customize subject based on event type
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

    // Determine success message based on event type
    const hasAnyFreeEvent = attendees.some(
      (attendee: any) => attendee.event?.type === "FREE"
    );
    const hasAnyPaidEvent = attendees.some(
      (attendee: any) => attendee.event?.type === "PAID"
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
    console.error("Event notification email error:", error);
    return NextResponse.json(
      { message: "ইমেল পাঠাতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}