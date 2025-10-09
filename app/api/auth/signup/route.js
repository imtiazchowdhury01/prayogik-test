import { db } from "../../../../lib/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { verifyEmailTemplate } from "../../../../lib/utils/emailTemplates/verify-email";

export async function POST(req) {
  const { name, username, email, password } = await req.json();

  if (!name || !email || !password || !username) {
    return new Response(JSON.stringify({ error: "সব ফিল্ড আবশ্যক" }), {
      status: 400,
    });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "ইমেইল বা ইউজারনেমটি ইতোমধ্যে ব্যবহার করা হয়েছে।" }),
        {
          status: 400,
        }
      );
    }

    const token = jwt.sign(
      { name, username, email, password },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
    const contactUrl = `${process.env.NEXT_PUBLIC_APP_URL}/contact`;

    const mailOptions = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: email,
      subject: "অনুগ্রহ করে আপনার ইমেইল যাচাই করুন",
      // html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
      html: verifyEmailTemplate(verificationUrl, contactUrl),
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        message:
          "ভেরিফিকেশন ইমেইল পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স চেক করুন।",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
