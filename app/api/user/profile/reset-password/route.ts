// api/user/profile/reset-password/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import bcrypt from "bcrypt";
import { ResetPasswordRequestSchema } from "@/lib/utils/openai/types";

export async function POST(request: Request) {
  try {
    const { userId } = await getServerUserSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { oldPassword, newPassword } = ResetPasswordRequestSchema.parse(body);

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "User does not have a password set" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "আপনার দেওয়া পুরনো পাসওয়ার্ড ভুল হয়েছে।" },
        { status: 400 }
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: "নতুন পাসওয়ার্ড পুরনো পাসওয়ার্ড থেকে ভিন্ন হতে হবে।" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        resetToken: null,
      },
    });

    return NextResponse.json(
      { message: "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
