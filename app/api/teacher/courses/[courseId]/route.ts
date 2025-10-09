// api/teacher/courses/[courseId]/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { CourseMode } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const { userId } = await getServerUserSession();
  const { courseId } = params;

  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  const teacherProfile = await db.teacherProfile.findUnique({
    where: { userId },
  });

  const teacherProfileId = teacherProfile?.id;

  if (!teacherProfileId) {
    return NextResponse.json(
      { error: true, message: "Teacher profile not found." },
      { status: 404 }
    );
  }

  try {
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        courseMode: CourseMode.RECORDED,
        OR: [
          { teacherProfileId },
          {
            coTeacherIds: {
              hasSome: [teacherProfileId],
            },
          },
        ],
      },
      include: {
        prices: true,
        lessons: { orderBy: { position: "asc" } },
        attachments: { orderBy: { createdAt: "desc" } },
        coTeachers: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        teacherProfile: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch course." },
      { status: 500 }
    );
  }
}
