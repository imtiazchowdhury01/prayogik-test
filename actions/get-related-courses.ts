// actions/get-related-courses.ts
"use server";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// Define the return type based on the actual query
type RelatedCourseResult = Prisma.CourseGetPayload<{
  include: {
    category: true;
    prices: true;
    enrolledStudents: {
      select: {
        id: true;
        studentProfileId: true;
      };
    };
    teacherProfile: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            username: true;
            email: true;
            avatarUrl: true;
            role: true;
          };
        };
      };
    };
  };
}>;

type GetRelatedCoursesParams = {
  userId?: string | null;
  categoryId: string;
  currentCourseId: string;
  limit?: number;
};

export const getRelatedCourses = async ({
  userId,
  categoryId,
  currentCourseId,
  limit = 4,
}: GetRelatedCoursesParams): Promise<RelatedCourseResult[]> => {
  try {
    let purchasedCourseIds: string[] = [];

    // If user is logged in, get their purchased courses
    if (userId) {
      const studentProfile = await db.studentProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });

      if (studentProfile) {
        const enrolledCourses = await db.enrolledStudents.findMany({
          where: {
            studentProfileId: studentProfile.id,
            courseId: { not: null },
          },
          select: {
            courseId: true,
          },
        });

        purchasedCourseIds = enrolledCourses
          .map((enrollment) => enrollment.courseId)
          .filter((courseId): courseId is string => courseId !== null);
      }
    }

    // Build the where clause
    const whereClause: Prisma.CourseWhereInput = {
      isPublished: true,
      categoryId,
      id: {
        not: currentCourseId,
        ...(purchasedCourseIds.length > 0 && { notIn: purchasedCourseIds }),
      },
    };

    const relatedCourses = await db.course.findMany({
      where: whereClause,
      include: {
        category: true,
        prices: true,
        enrolledStudents: {
          select: {
            id: true,
            studentProfileId: true,
          },
        },
        teacherProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return relatedCourses;
  } catch (error) {
    console.error("[GET_RELATED_COURSES]", error);
    return [];
  }
};
