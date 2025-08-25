// @ts-nocheck
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, password } = await req.json();

  try {
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const mailOptions = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: email,
      subject: "প্রয়োগিক LMS-এর জন্য লগইন তথ্য",
      html: `<h3>স্বাগতম <a href="${process.env.NEXT_PUBLIC_APP_URL}">প্রয়োগিক LMS</a></h3>
         <p>আপনার লগইন তথ্য নিচে দেওয়া হলো:/p>
         <p><strong>ইমেইল:</strong> ${email}</p>
         <p><strong>পাসওয়ার্ড:</strong> ${password}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        message: "লগইন তথ্য সহ ইমেইল সফলভাবে পাঠানো হয়েছে।",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while sending email:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
