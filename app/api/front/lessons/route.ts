// api/front/lessons/route.ts
import { NextRequest, NextResponse } from "next/server";

interface EmptyResponse {
  message: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<EmptyResponse>> {
  return NextResponse.json({ message: "This is an empty API route" });
}
