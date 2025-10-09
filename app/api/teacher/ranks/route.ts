// api/teacher/ranks/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ranks = await db.teacherRank.findMany();
    return NextResponse.json(ranks);
  } catch (error) {
    console.error("Error fetching ranks:", error);
    return NextResponse.json(
      { error: "Failed to fetch ranks" },
      { status: 500 }
    );
  }
}
