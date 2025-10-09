// actions/get-courses.ts
"use server";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { unslugify } from "@/lib/generateSlug";
import type { Prisma } from "@prisma/client";

type CourseResult = {
  id: string;
  title: string;
  slug: string;
  totalDuration: number | null;
  category: Prisma.CategoryGetPayload<true> | null;
  isUnderSubscription: boolean;
  imageUrl: string | null;
  prices: Array<{
    regularAmount: number;
    discountedAmount: number | null;
    isFree: boolean;
  }>;
  _count: {
    enrolledStudents: number;
  };
  teacherProfile: {
    user: {
      name: string;
    };
  };
  lessons: Array<{
    id: string;
    slug: string;
    isPublished: boolean;
    isFree: boolean;
    videoUrl: string | null;
    Progress: Prisma.ProgressGetPayload<true>[];
    position: number;
  }>;
  enrolledStudents: Array<{
    id: string;
    studentProfileId: string;
  }>;
};

type CourseWithProgress = CourseResult & {
  progress: number | null;
};

type GetCoursesParams = {
  userId?: string | null;
  title?: string;
  categoryId?: string;
  page?: string;
  category?: string;
  limit?: number;
  search?: string;
  sort?: "asc" | "desc";
};

type GetCoursesResponse = {
  data: CourseWithProgress[];
  meta: {
    total: number;
  };
};

const courseFilters = ({
  title,
  categoryId,
  category,
  search,
}: GetCoursesParams): Prisma.CourseWhereInput => {
  const filters: Prisma.CourseWhereInput = {
    isPublished: true,
  };

  if (title) {
    filters.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (search) {
    filters.title = {
      contains: unslugify(search),
      mode: "insensitive",
    };
  }

  if (categoryId) {
    filters.categoryId = categoryId;
  }

  if (category) {
    filters.category = {
      slug: category,
    };
  }

  return filters;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
  page,
  category,
  search,
  limit = 12,
  sort = "desc",
}: GetCoursesParams): Promise<GetCoursesResponse> => {
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
      studentProfileId = studentProfile?.id ?? null;
    }

    const courses = await db.course.findMany({
      where: courseFilters({ title, categoryId, category, search }),
      select: {
        id: true,
        title: true,
        slug: true,
        totalDuration: true,
        category: true,
        isUnderSubscription: true,
        imageUrl: true,
        prices: {
          select: {
            regularAmount: true,
            discountedAmount: true,
            isFree: true,
          },
        },
        _count: {
          select: {
            enrolledStudents: true,
          },
        },
        teacherProfile: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        lessons: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            slug: true,
            isPublished: true,
            isFree: true,
            videoUrl: true,
            Progress: true,
            position: true,
          },
        },
        enrolledStudents: studentProfileId
          ? {
              where: {
                studentProfileId: studentProfileId,
              },
              select: {
                id: true,
                studentProfileId: true,
              },
            }
          : true,
      },
      orderBy: {
        createdAt: sort,
      },
      take: Number(limit),
    });

    const coursesWithProgress: CourseWithProgress[] = await Promise.all(
      courses.map(async (course) => {
        let progressPercentage: number | null = null;

        // Check if user is enrolled
        const isEnrolled = studentProfileId
          ? course.enrolledStudents.some(
              (enrollment) => enrollment.studentProfileId === studentProfileId
            )
          : false;

        if (userId && isEnrolled) {
          progressPercentage = await getProgress(userId, course.id);
        }

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    const totalCourses = await db.course.count({
      where: courseFilters({ title, categoryId, category, search }),
    });

    return {
      data: coursesWithProgress,
      meta: { total: totalCourses },
    };
  } catch (error) {
    console.error("[GET_COURSES]", error);
    return {
      data: [],
      meta: { total: 0 },
    };
  }
};
