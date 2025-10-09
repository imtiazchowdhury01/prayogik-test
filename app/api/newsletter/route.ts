// api/newsletter/route.ts
import { db } from "@/lib/db";
import {
  newsletterAdminNotificationTemplate,
  newsletterSubscriberConfirmationTemplate,
} from "@/lib/utils/emailTemplates/comingsoon-newsletter";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// ========== TYPE DEFINITIONS ==========

const newsletterSchema = z.object({
  email: z.string().email("একটি বৈধ ইমেইল প্রবেশ করুন"),
});

interface NewsletterRequest {
  email: string;
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface ErrorResponse {
  success?: boolean;
  message: string;
  details?: any;
  error?: string;
}

// ========== POST HANDLER ==========

export async function POST(
  req: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body: NewsletterRequest = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "বৈধ ইমেইল প্রয়োজন।" },
        { status: 400 }
      );
    }

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

    // Check if email already exists
    const existingSubscriber = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        {
          success: false,
          message: "এই ইমেইলটি ইতিমধ্যেই সাবস্ক্রাইব করা আছে।",
        },
        { status: 400 }
      );
    }

    // Get or create "Launch" tag
    let launchTag = await db.newsletterTag.findUnique({
      where: { name: "Launch" },
    });

    if (!launchTag) {
      launchTag = await db.newsletterTag.create({
        data: { name: "Launch", leads: 0 },
      });
    }

    // Create new subscriber
    const newSubscriber = await db.newsletterSubscriber.create({
      data: {
        email,
        tagId: launchTag.id,
      },
    });

    // Update tag leads count
    await db.newsletterTag.update({
      where: { id: launchTag.id },
      data: { leads: { increment: 1 } },
    });

    // Validate SMTP configuration
    if (
      !process.env.SMTP_USERNAME ||
      !process.env.SMTP_APP_PASS ||
      !process.env.ADMIN_RECIPIENT_EMAIL
    ) {
      throw new Error("SMTP configuration is missing");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const contactUrl = `${baseUrl}/contact`;

    // Send admin notification
    const adminMailOptions = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: process.env.ADMIN_RECIPIENT_EMAIL,
      subject: "প্রায়োগিক: নতুন নিউজলেটার সাবস্ক্রিপশন",
      html: newsletterAdminNotificationTemplate(email, baseUrl),
    };

    await transporter.sendMail(adminMailOptions);

    // Send subscriber confirmation
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

    await transporter.sendMail(subscriberMailOptions);

    return NextResponse.json({
      success: true,
      message: "সফলভাবে সাবস্ক্রাইব হয়েছে! আমরা শীঘ্রই আপনাকে আপডেট জানাব।",
    });
  } catch (error) {
    console.error("[NEWSLETTER_SUBSCRIPTION_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "সাবস্ক্রিপশনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
