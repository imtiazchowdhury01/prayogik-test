// @ts-nocheck
import { db } from "@/lib/db";
import {
  newsletterAdminNotificationTemplate,
  newsletterSubscriberConfirmationTemplate,
} from "@/lib/utils/emailTemplates/comingsoon-newsletter";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Newsletter subscription schema
const newsletterSchema = z.object({
  email: z.string().email("একটি বৈধ ইমেইল প্রবেশ করুন"),
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: "বৈধ ইমেইল প্রয়োজন।" },
        { status: 400 }
      );
    }

    // Validate email format
    const validation = newsletterSchema.safeParse({ email });
    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.errors[0].message,
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }
    // ----------------------------
    // First, check if the email already exists
    const existingSubscriber = await db.newsletterSubscriber.findUnique({
      where: { email },
    });
    // console.log("existingSubscriber result:", existingSubscriber);

    if (existingSubscriber) {
      return NextResponse.json(
        {
          success: false,
          message: "এই ইমেইলটি ইতিমধ্যেই সাবস্ক্রাইব করা আছে।",
        },
        { status: 400 }
      );
    }

    // Get the "Launch" tag or create it if it doesn't exist
    let launchTag = await db.newsletterTag.findUnique({
      where: { name: "Launch" },
    });
    // console.log("launchTag result:", launchTag);

    if (!launchTag) {
      launchTag = await db.newsletterTag.create({
        data: { name: "Launch" },
      });
    }

    // Create the new subscriber 
    const newSubscriber = await db.newsletterSubscriber.create({ 
      data: {
        email,
        tagId: launchTag.id, // Associate with the "Launch" tag
      },
    });
    // console.log("newSubscriber result:", newSubscriber);
    // ----------------------------

    // Validate environment variables
    if (
      !process.env.SMTP_USERNAME ||
      !process.env.SMTP_APP_PASS ||
      !process.env.ADMIN_RECIPIENT_EMAIL
    ) {
      throw new Error("SMTP configuration is missing");
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const contactUrl = `${baseUrl}/contact`;

    // Email to admin about new subscription
    const adminMailOptions = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: process.env.ADMIN_RECIPIENT_EMAIL,
      subject: "প্রায়োগিক: নতুন নিউজলেটার সাবস্ক্রিপশন",
      html: newsletterAdminNotificationTemplate(email, baseUrl),
    };

    // Send notification email to admin
    await transporter.sendMail(adminMailOptions);

    // Send confirmation email to subscriber
    const subscriberMailOptions = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: email,
      subject: "প্রায়োগিক নিউজলেটারে স্বাগতম!",
      html: newsletterSubscriberConfirmationTemplate(
        email,
        baseUrl,
        contactUrl
      ),
    };

    // Send confirmation email to subscriber
    await transporter.sendMail(subscriberMailOptions);

    return NextResponse.json({
      success: true,
      message: "সফলভাবে সাবস্ক্রাইব হয়েছে! আমরা শীঘ্রই আপনাকে আপডেট জানাব।",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "সাবস্ক্রিপশনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
