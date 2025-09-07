// @ts-nocheck
import { contactFormSubmissionTemplate } from "@/lib/utils/emailTemplates/contact-form-submission";
import { contactFormSchema } from "@/app/(site)/contact/_schema/contactFormSchema";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { teachingFormSubmissionTemplate } from "@/lib/utils/emailTemplates/teaching-form-submission-template";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const {
      name,
      email,
      message,
      subject,
      recaptchaToken,
      formType = "contact",
      phone,
      facebookUrl,
      linkedinUrl,
      youtubeUrl,
      websiteUrl,
      courseProposals,
    } = requestData;

    // Basic required fields validation (common for both forms)
    if (!name || !email || !recaptchaToken) {
      return NextResponse.json(
        { message: "নাম, ইমেইল এবং রিক্যাপচা আবশ্যক।" },
        { status: 400 }
      );
    }

    // Form type specific validation
    if (formType === "contact") {
      if (!subject || !message) {
        return NextResponse.json(
          { message: "বিষয় এবং বিস্তারিত ক্ষেত্রগুলি আবশ্যক।" },
          { status: 400 }
        );
      }
    } else if (formType === "teaching") {
      if (!courseProposals || courseProposals.length === 0) {
        return NextResponse.json(
          { message: "অন্তত একটি কোর্স প্রস্তাবনা আবশ্যক।" },
          { status: 400 }
        );
      }

      // Validate each course proposal
      // for (let i = 0; i < courseProposals.length; i++) {
      //   const proposal = courseProposals[i];
      //   if (
      //     !proposal.courseTitle ||
      //     !proposal.courseDetails ||
      //     !proposal.category ||
      //     proposal.category.length === 0
      //   ) {
      //     return NextResponse.json(
      //       { message: `কোর্স প্রস্তাবনা ${i + 1}: সব ক্ষেত্র পূরণ করুন।` },
      //       { status: 400 }
      //     );
      //   }
      // }
      for (let i = 0; i < courseProposals.length; i++) {
        const proposal = courseProposals[i];
        if (
          !proposal.courseTitle ||
          !proposal.courseDetails ||
          !proposal.category
        ) {
          return NextResponse.json(
            { message: `কোর্স প্রস্তাবনা ${i + 1}: সব ক্ষেত্র পূরণ করুন।` },
            { status: 400 }
          );
        }
      }
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL + "";

    // Generate email content based on form type
    let emailHtml;
    let emailSubject;

    if (formType === "teaching") {
      emailHtml = teachingFormSubmissionTemplate(
        name,
        email,
        message,
        phone || "",
        facebookUrl || "",
        linkedinUrl || "",
        youtubeUrl || "",
        websiteUrl || "",
        courseProposals || [],
        baseUrl
      );
     emailSubject = `প্রায়োগিক - নতুন শিক্ষক আবেদন।`;
    } else {
      emailHtml = contactFormSubmissionTemplate(
        name,
        email,
        subject,
        message,
        baseUrl
      );
      emailSubject = `প্রায়োগিক - নতুন যোগাযোগ ফর্ম জমা হয়েছে।`;
    }

    const mailOptions = {
      from: "Prayogik",
      replyTo: email,
      to: process.env.ADMIN_RECIPIENT_EMAIL,
      subject: emailSubject,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    const successMessage =
      formType === "teaching"
        ? "আপনার শিক্ষকতার আবেদন সফলভাবে জমা দেওয়া হয়েছে!"
        : "ইমেল সফলভাবে পাঠানো হয়েছে!";

    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { message: "ইমেল পাঠাতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
