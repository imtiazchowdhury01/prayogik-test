// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { db } from "@/lib/db";
import { Role, User } from "@prisma/client";

export async function POST(req: Request) {
  const { userId, isAdmin } = await getServerUserSession();

  try {
    const { role } = await req.json();

    const user: User = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const validRoles = Object.values(Role);
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const isTeacher = await db.teacherProfile.findUnique({
      where: { userId, teacherStatus: "VERIFIED" },
    });

    if (
      !isAdmin &&
      role !== "ADMIN" &&
      !isTeacher &&
      role !== "TEACHER" &&
      role !== "STUDENT"
    ) {
      return NextResponse.json(
        { message: "Do not have access!" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ role });
  } catch (error) {
    return NextResponse.json(
      { message: "Error switching role." },
      { status: 500 }
    );
  }
}
