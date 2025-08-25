import jwt from "jsonwebtoken";
import { db } from "../../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return new Response(
      JSON.stringify({ error: "Token and password are required." }),
      {
        status: 400,
      }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await db.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user || user.resetToken !== token) {
      return new Response(JSON.stringify({ error: "Invalid token." }), {
        status: 400,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { email: decoded.email },
      data: {
        password: passwordHash,
        resetToken: null,
      },
    });

    return new Response(
      JSON.stringify({ message: "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response(
      JSON.stringify({ error: "Failed to reset password." }),
      {
        status: 400,
      }
    );
  }
}
