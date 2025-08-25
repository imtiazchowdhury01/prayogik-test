// @ts-nocheck

import { NextResponse } from "next/server";
import { db } from "@/lib/db";


// get all teachers 
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
        },
      },
    },
  });

  return NextResponse.json(usersWithTeacherDetails);
}
