// api/admin/teachers/details/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const usersWithTeacherDetails = await db.user.findMany({
      where: {
        teacherProfile: {
          teacherStatus: { not: "NONE" },
        },
      },
      include: {
        teacherProfile: {
          include: {
            teacherRank: true,
          },
        },
      },
    });

    return NextResponse.json(usersWithTeacherDetails);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
