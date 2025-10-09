// api/vdocipher/otp/route.ts
import { getServerUserSession } from "@/lib/getServerUserSession";

const vdocipherApiKey = process.env.VDOCIPHER_API_SECRET;

export async function POST(request) {
  const body = await request.json();
  const { videoId } = body;

  const { userId, email, name, phoneNumber } = await getServerUserSession();

  const url = `https://dev.vdocipher.com/api/videos/${videoId}/otp`;
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Apisecret ${vdocipherApiKey}`,
    },
    body: JSON.stringify({
      annotate: JSON.stringify([
        {
          type: "rtext",
          text: ` ${email || ""}`,
          alpha: "0.25",
          x: "10", //the distance from the left border of video.
          y: "50", //the distance from the top border of video.
          color: "0xFF0000",
          size: "8",
          interval: "5000", // Total cycle time (5s show for each of 3 items)
          skip: "15000", // Shows immediately
        },
        // {
        //   type: "rtext",
        //   text: ` ${name || ""}`,
        //   alpha: "0.60",
        //   color: "0xFF0000",
        //   size: "15",
        //   interval: "15000", // Total cycle time
        //   skip: "5000", // Shows after 5 seconds
        // },
        // {
        //   type: "rtext",
        //   text: ` ${phoneNumber || ""}`,
        //   alpha: "0.60",
        //   color: "0xFF0000",
        //   size: "15",
        //   interval: "15000", // Total cycle time
        //   skip: "10000", // Shows after 10 seconds
        // },
      ]),
      ttl: 300,
      userId: userId,
      // whitelisthref: process.env.NEXT_PUBLIC_APP_URL,
    }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: true,
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
