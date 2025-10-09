// @ts-nocheck
import { sendResetEmail } from "@/actions/auth/send-reset-email";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return new Response(
      JSON.stringify({ error: "অনুগ্রহ করে ইমেইল প্রদান করুন" }),
      {
        status: 400,
      }
    );
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          error: "দুঃখিত, এমন কোনো ইউজার খুঁজে পাওয়া যায়নি!",
        }),
        {
          status: 404,
        }
      );
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    await db.user.update({
      where: { email },
      data: {
        resetToken,
      },
    });

    const result = await sendResetEmail(email, resetToken);

    if (result.error) {
      return new Response(
        JSON.stringify({
          error: "পাসওয়ার্ড রিসেটের ইমেইল পাঠাতে ব্যর্থ হয়েছে।",
        }),
        {
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        message:
          "পাসওয়ার্ড রিসেটের ইমেইল পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স পরীক্ষা করুন।",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during password reset:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
