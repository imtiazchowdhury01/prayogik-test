// api/auth/check-username/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  try {
    const existingUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          isAvailable: false,
          message: "Username is not available.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          isAvailable: true,
          message: "ইউজারনেমটি ব্যবহারযোগ্য।",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        isAvailable: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
