// @ts-nocheck
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateUsername } from "@/lib/utils/stringUtils";
import nodemailer from "nodemailer";
import { sendCredentialTemplate } from "@/lib/utils/emailTemplates/send-credential-template";
import { accountCreationTemplate } from "@/lib/utils/emailTemplates/account-creation";

export async function POST(req) {
  const { name, email, password, username, sendCredentials } = await req.json();

  if (!name || !email || !password || !username) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "ইউজার ইতোমধ্যে রয়েছে" }), {
        status: 400,
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const passwordHash = await bcrypt.hash(password, 10);

    // Username generate
    // let username = generateUsername(name);

    let usernameExists = await db.user.findUnique({
      where: { username },
    });

    if (usernameExists) {
      return new Response(
        JSON.stringify({ error: "ইউজারনেম ইতোমধ্যে রয়েছে!" }),
        {
          status: 400,
        }
      );
    }

    // while (usernameExists) {
    //   username = generateUsername(name); // Regenerate username if already taken
    //   usernameExists = await db.user.findUnique({
    //     where: { username },
    //   });
    // }

    // Create the user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        username,
        password: passwordHash,
        emailVerified: true,
        emailVerificationToken: token,
        tokenUsed: true,
      },
    });

    // Create the student profile with the newly created userId
    await db.studentProfile.create({
      data: {
        userId: newUser.id, // Set the userId to the created user's id
      },
    });

    // if sendCredentials is true then send the credentials to the user
    if (sendCredentials) {
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
        subject: "প্রয়োগিকে স্বাগতম! আপনার অ্যাকাউন্ট তৈরি হয়েছে।",
        html: accountCreationTemplate(name, email, username, password),
      };

      await transporter.sendMail(mailOptions);
    }

    if (sendCredentials) {
      return NextResponse.json(
        `ইউজার সফলভাবে তৈরি হয়েছে এবং ইমেইল পাঠানো হয়েছে!`,
        { status: 201 }
      );
    } else {
      return NextResponse.json(`ইউজার সফলভাবে তৈরি হয়েছে!`, { status: 201 });
    }
  } catch (error) {
    console.error("Error during add user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
