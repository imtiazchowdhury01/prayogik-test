// @ts-nocheck
import { contactFormSubmissionTemplate } from "@/lib/utils/emailTemplates/contact-form-submission";
import { contactFormSchema } from "@/app/(site)/contact/_schema/contactFormSchema";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create an extended schema that includes the reCAPTCHA token
const extendedContactFormSchema = contactFormSchema.extend({
  recaptchaToken: String(),
});

export async function POST(req: Request) {
  try {
    const { name, email, message, subject, recaptchaToken } = await req.json();

    if (!name || !email || !message || !subject || !recaptchaToken) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA v2 token
    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    // For reCAPTCHA v2, we only need to check success, not score
    if (!recaptchaData.success) {
      return NextResponse.json(
        {
          message:
            "রিক্যাপচা যাচাইকরণ ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        },
        { status: 400 }
      );
    }

    // Validate form data
    const validation = contactFormSchema.safeParse({
      name,
      email,
      message,
      subject,
    });

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL + "";
    const mailOptions = {
      from: "Prayogik",
      replyTo: email,
      to: process.env.ADMIN_RECIPIENT_EMAIL,
      subject: `Prayogik: New Entry from Prayogik`,
      html: contactFormSubmissionTemplate(
        name,
        email,
        subject,
        message,
        baseUrl
      ),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "ইমেল সফলভাবে পাঠানো হয়েছে!",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { message: "ইমেল পাঠাতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
