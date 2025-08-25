export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await getServerUserSession(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teachers = await db.user.findMany({
      where: {
        teacherProfile: {
          teacherStatus: { not: "NONE" },
        },
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        email: true,
        emailVerified: true,
        teacherProfile: {
          select: {
            id: true,
            teacherStatus: true,
            teacherRank: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!teachers) {
      return NextResponse.json(
        { error: "teachers not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers details:", error);
    return NextResponse.error();
  }
}
