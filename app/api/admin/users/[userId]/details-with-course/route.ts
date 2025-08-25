// @ts-nocheck

import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Fetch all published courses for a teacher based on teacherProfileId
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;





  try {
    // Fetch all published courses for the teacher
   const teacher = await db.user.findUnique({
     where: { id: userId },
     include: {
       teacherProfile: {
         include: {
           teacherRank: true,
           createdCourses: {
             include: {
               enrolledStudents: true,
               prices: true,
               enrolledStudents: true,
             },
           },
         },
       },
     },
   });

    if (!teacher || teacher?.createdCourses?.length === 0) {
      return NextResponse.json(
        { message: "No published courses found for this teacher" },
        { status: 404 }
      );
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Error fetching published courses:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
