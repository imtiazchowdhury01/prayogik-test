// api/courses/premium/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { userId } = await getServerUserSession(request);
    const take = searchParams.get("take");

    // Fetch premium/subscription courses
    const courses = await db.course.findMany({
      take: take === "all" ? undefined : Number(take || 10),
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isPublished: true,
        isUnderSubscription: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        prices: true,
        isPublished: true,
        isUnderSubscription: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            isPublished: true,
            isFree: true,
            slug: true,
            description: true,
            videoUrl: true,
            position: true,
            videoStatus: true,
          },
        },
        teacherProfile: {
          select: {
            id: true,
            userId: true,
            totalSales: true,
            lastPaymentDate: true,
            lastPaymentAmount: true,
            teacherStatus: true,
            subjectSpecializations: true,
            certifications: true,
            yearsOfExperience: true,
            expertiseLevel: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                dateOfBirth: true,
                gender: true,
                education: true,
                nationality: true,
                phoneNumber: true,
                city: true,
                state: true,
                country: true,
                zipCode: true,
                facebook: true,
                linkedin: true,
                twitter: true,
                youtube: true,
                website: true,
                others: true,
              },
            },
          },
        },
        enrolledStudents: {
          select: {
            id: true,
            studentProfileId: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get user's purchased course IDs
    let purchasedCourseIds: string[] = [];

    if (userId) {
      const studentProfile = await db.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (studentProfile) {
        const purchasedCourses = await db.purchase.findMany({
          where: {
            studentProfileId: studentProfile.id,
          },
          select: {
            courseId: true,
          },
        });

        purchasedCourseIds = purchasedCourses
          .map((purchase) => purchase.courseId)
          .filter((id): id is string => id !== null);
      }
    }

    return NextResponse.json({ courses, purchasedCourseIds });
  } catch (error) {
    console.error("[GET_PREMIUM_COURSES_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
