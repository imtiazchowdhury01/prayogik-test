import jwt from "jsonwebtoken";
import { db } from "../../../../lib/db";

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    return new Response(JSON.stringify({ error: "Token is required." }), {
      status: 400,
    });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    
    const user = await db.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user || !user.resetToken || user.resetToken !== token) {
      return new Response(JSON.stringify({ error: "Invalid token." }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ message: "Token is valid." }), {
      status: 200,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return new Response(
      JSON.stringify({ error: "Token verification failed." }),
      {
        status: 400,
      }
    );
  }
}
