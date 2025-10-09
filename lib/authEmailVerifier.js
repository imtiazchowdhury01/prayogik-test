import jwt from "jsonwebtoken";
import { db } from "./db";
import bcrypt from "bcrypt";

export async function authEmailVerifier(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { name, username, email, password } = decoded;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      if (!existingUser.isVerified) {
        await db.user.update({
          where: { email },
          data: { isVerified: true },
        });
        return { message: "User verified successfully" };
      } else {
        throw new Error("User is already verified");
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

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

    // Create the student profile linked to the new user
    await db.studentProfile.create({
      data: {
        userId: newUser.id,
      },
    });

    return { message: "User created successfully" };
  } catch (error) {
    throw new Error("Verification failed!");
  }
}
