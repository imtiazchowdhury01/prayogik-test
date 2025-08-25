// @ts-nocheck
import axios from "axios";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  try {
    const apiSecret = process.env.VDOCIPHER_API_SECRET;

    const response = await fetch(
      `https://dev.vdocipher.com/api/videos/${videoId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${apiSecret}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch video length" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ length: data.length });
  } catch (error) {
    console.error("Error fetching video length:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  // Construct the URL for deleting the video
  const apiSecret = process.env.VDOCIPHER_API_SECRET;
  if (!apiSecret) {
    throw new Error("API Secret is not defined.");
  }

  const url = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;

  // Attempt to delete the video from VdoCipher
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Apisecret ${apiSecret}`,
      },
    });

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Response from VdoCipher: ${errorText}`);
      throw new Error(
        `Failed to delete video ${videoId}: ${response.status} - ${errorText}`
      );
    }

    // Get the response data
    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (videoError) {
    const videoErrorMessage =
      videoError instanceof Error ? videoError.message : "Unknown error";
    console.error(
      `Failed to delete video ${videoId} from VdoCipher`,
      videoErrorMessage
    );
    return new NextResponse(
      `Failed to delete video from VdoCipher: ${videoErrorMessage}`,
      { status: 500 }
    );
  }
}
