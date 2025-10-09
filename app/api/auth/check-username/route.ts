// @ts-nocheck
import { db } from "@/lib/db";

export async function POST(req, res) {
  const { username } = await req.json();

  try {
    // Example: Simulating a check against an existing list of usernames
    const existingUsername = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return new Response(
        JSON.stringify({
          isAvailable: false,
          message: "Username is not available.",
        }),
        { status: 400 }
      );
    } else {
      return new Response(
        JSON.stringify({
          isAvailable: true,
          message: "ইউজারনেমটি ব্যবহারযোগ্য।.",
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        isAvailable: false,
        message: "Something went wrong.",
      }),
      { status: 500 }
    );
  }
}
