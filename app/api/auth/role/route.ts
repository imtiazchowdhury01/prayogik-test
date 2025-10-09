// api/auth/role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await getServerUserSession();

  if (!session || !session.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { userId, isAdmin } = session;

  try {
    const { role } = await req.json();

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: true,
        studentProfile: true,
        affiliateProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validate role enum
    const validRoles = Object.values(Role);
    if (!validRoles.includes(role as Role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Role-specific validation
    if (role === Role.TEACHER) {
      if (
        !user.teacherProfile ||
        user.teacherProfile.teacherStatus !== "VERIFIED"
      ) {
        return NextResponse.json(
          {
            message:
              "You must have a verified teacher profile to switch to teacher role",
          },
          { status: 403 }
        );
      }
    }

    if (role === Role.AFFILIATE) {
      if (
        !user.affiliateProfile ||
        user.affiliateProfile.affiliateStatus !== "ACTIVE"
      ) {
        return NextResponse.json(
          {
            message:
              "You must have an active affiliate profile to switch to affiliate role",
          },
          { status: 403 }
        );
      }
    }

    if (role === Role.ADMIN && !isAdmin) {
      return NextResponse.json(
        { message: "You do not have permission to switch to admin role" },
        { status: 403 }
      );
    }

    // Update user role
    await db.user.update({
      where: { id: userId },
      data: { role: role as Role },
    });

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error switching role:", error);
    return NextResponse.json(
      { message: "Error switching role." },
      { status: 500 }
    );
  }
}
