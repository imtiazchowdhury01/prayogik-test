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
      select: {
        name: true,
        bio: true,
        avatarUrl: true,
        username: true,
        accountStatus: true,
        facebook: true,
        twitter: true,
        linkedin: true,
        youtube: true,
        website: true,
        teacherProfile: {
          select: {
            yearsOfExperience: true,
            subjectSpecializations: true,
            createdCourses: {
              select: {
                id: true,
                title: true,
                slug: true,
                imageUrl: true,
                isPublished: true,
                prices: {
                  select: {
                    regularAmount: true,
                    isFree: true,
                  },
                },
                isUnderSubscription: true,
                _count: {
                  select: {
                    enrolledStudents: true,
                  },
                },
                lessons: {
                  where: {
                    isPublished: true,
                  },
                  select: {
                    id: true,
                    title: true,
                    videoUrl: true,
                    isFree: true,
                  },
                  take: 1,
                },
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
