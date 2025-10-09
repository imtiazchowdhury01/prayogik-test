// actions/get-home-courses.ts
"use server";

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getProgress } from "./get-progress";
import type { Prisma } from "@prisma/client";

type CourseWithProgress = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  totalDuration: number | null;
  learningOutcomes: string[];
  requirements: string[];
  whoFor: string[];
  isPublished: boolean;
  isUnderSubscription: boolean;
  courseType: string;
  ownership: string;
  feePercentage: number | null;
  feeAmount: number | null;
  courseMode: string;
  courseLiveLink: string | null;
  courseLiveLinkPassword: string | null;
  courseLiveBatchStartedAt: Date | null;
  totalLiveClass: number | null;
  teacherProfileId: string;
  coTeacherIds: string[];
  categoryId: string | null;
  membershipPlanIds: string[];
  bundleIds: string[];
  certificationIds: string[];
  subscriptionPlanId: string | null;
  trialSubscriptionId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category: Prisma.CategoryGetPayload<true> | null;
  lessons: Array<{
    id: string;
    title: string;
    slug: string;
    position: number;
    duration: number | null;
    isFree: boolean;
  }>;
  teacherProfile: Prisma.TeacherProfileGetPayload<{
    include: {
      user: {
        select: {
          name: true;
          email: true;
          avatarUrl: true;
        };
      };
    };
  }>;
  prices: Prisma.PriceGetPayload<true>[];
  rating: Prisma.RatingGetPayload<true>[];
  review: Prisma.ReviewGetPayload<true>[];
  enrolledStudents: Array<{
    id: string;
    studentProfileId: string;
    courseId: string | null;
  }>;
  progress: number | null;
  isEnrolled: boolean;
};

export async function getHomeCourses(): Promise<CourseWithProgress[]> {
  const { userId } = await getServerUserSession();

  try {
    let studentProfileId: string | null = null;

    // Get student profile if user is logged in
    if (userId) {
      const studentProfile = await db.studentProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });
      studentProfileId = studentProfile?.id || null;
    }

    // Fetch courses with related data
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        lessons: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            position: true,
            duration: true,
            isFree: true,
          },
        },
        teacherProfile: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        prices: true,
        rating: true,
        review: true,
        enrolledStudents: studentProfileId
          ? {
              where: {
                studentProfileId: studentProfileId,
              },
              select: {
                id: true,
                studentProfileId: true,
                courseId: true,
              },
            }
          : true, // Changed from false to true
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add progress for enrolled courses
    const coursesWithProgress: CourseWithProgress[] = await Promise.all(
      courses.map(async (course) => {
        let progressPercentage: number | null = null;

        // enrolledStudents is now always an array
        const userEnrollment = studentProfileId
          ? course.enrolledStudents.find(
              (enrollment) => enrollment.studentProfileId === studentProfileId
            )
          : null;

        const isEnrolled = !!userEnrollment;

        if (userId && isEnrolled) {
          progressPercentage = await getProgress(userId, course.id);
        }

        return {
          ...course,
          progress: progressPercentage,
          isEnrolled,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.error("[GET_HOME_COURSES]", error);
    return [];
  }
}
