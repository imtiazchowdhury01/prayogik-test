// api/user/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await getServerUserSession();

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "Invalid user ID provided" },
      { status: 400 }
    );
  }

  try {
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: {
          include: {
            teacherRank: true,
          },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { emailVerificationToken, resetToken, password, ...userData } =
      currentUser;

    return NextResponse.json({ ...userData, hasPassword: !!password });
  } catch (error) {
    console.error("Error fetching user details:", error);

    return NextResponse.json(
      { error: "An error occurred while fetching user details" },
      { status: 500 }
    );
  }
}
