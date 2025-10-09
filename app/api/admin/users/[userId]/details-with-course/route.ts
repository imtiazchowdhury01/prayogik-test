// api/admin/users/[userId]/details-with-course/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
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
              },
            },
          },
        },
      },
    });

    if (
      !teacher ||
      !teacher.teacherProfile ||
      teacher.teacherProfile.createdCourses.length === 0
    ) {
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
