// @ts-nocheck
import { Category, Course } from "@prisma/client";
import { db } from "@/lib/db";

type CourseWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
};

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
}: GetRelatedCoursesParams): Promise<CourseWithCategory[]> => {
  try {
    let studentProfileId: string | null = null; // Initialize as null
    if (userId) {
      const studentProfile = await db.studentProfile.findUnique({
        where: {
          userId: userId,
        },
      });
      studentProfileId = studentProfile?.id || null; // Extract ID or set to null
    }

    let purchasedCourseIds: string[] = [];
    if (studentProfileId) {
      const purchasedCourses = await db.enrolledStudents.findMany({
        where: { studentProfileId },
        select: { courseId: true },
      });

      purchasedCourseIds = purchasedCourses
        .map((purchase) => purchase.courseId)
        .filter((courseId) => courseId !== null) as string[]; // Filter out null values and assert type
    }

    const relatedCourses = await db.course.findMany({
      where: {
        isPublished: true,
        categoryId,
        id: {
          not: currentCourseId,
        },
        NOT: {
          // Use NOT to exclude courses
          id: {
            in: purchasedCourseIds.length > 0 ? purchasedCourseIds : undefined, // Use undefined if empty
          },
        },
      },
      include: {
        category: true,
        prices: true,
        enrolledStudents: true,
        teacherProfile: {
          include: {
            user: true,
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
