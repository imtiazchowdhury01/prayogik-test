// @ts-nocheck
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { useStudentProfile } from "@/hooks/useStudentProfile";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Use the request parameter instead of undefined req
    const { userId, info } = await getServerUserSession(request);
    const currentRoute = searchParams.get("currentRoute");
    const take = searchParams.get("take");

    // Fetch courses with or without limit based on the `take` parameter
    const courses = await db.course.findMany({
      take: take === "all" ? undefined : Number(take || 10), // Fetch 10 courses by default, or all if `take=all`
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
        enrolledStudents: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //users purchased courseIDs

    let purchasedCourseIds = [];
    let studentProfileId;
    if (userId) {
      studentProfileId = await useStudentProfile(userId);
    }
    if (studentProfileId) {
      const purchasedCourses = await db.purchase.findMany({
        where: {
          studentProfileId: studentProfileId,
        },
        select: {
          courseId: true,
        },
      });

      purchasedCourseIds = purchasedCourses.map(
        (purchase) => purchase.courseId
      );
    }

    return NextResponse.json({ courses, purchasedCourseIds });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
