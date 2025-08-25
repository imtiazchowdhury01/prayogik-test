import { NextResponse } from "next/server";
import { authEmailVerifier } from "../../../../lib/authEmailVerifier";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header is missing or invalid",
        },
        { status: 403 }
      );
    }

    const token = authHeader.split(" ")[1];

    const body = await req.json();
    const { secret } = body;

    if (secret && secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json(
        { success: false, message: "Invalid secret" },
        { status: 403 }
      );
    }

    const result = await authEmailVerifier(token);

    return NextResponse.json(
      { success: true, message: result.message },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 400 }
    );
  }
}
