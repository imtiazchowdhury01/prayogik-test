// api/teacher/details/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
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
          createdCourses: true,
        },
      },
    },
  });

  return NextResponse.json(usersWithTeacherDetails);
}
