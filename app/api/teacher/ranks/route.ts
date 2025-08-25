// @ts-nocheck
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET API to fetch teacher ranks
export async function GET() {
  try {
    // Fetching ranks from the database using Prisma
    const ranks = await db.teacherRank.findMany();

    // Return ranks as JSON response
    return NextResponse.json(ranks);
  } catch (error) {
    console.error("Error fetching ranks:", error);
    return NextResponse.error();
  }
}
