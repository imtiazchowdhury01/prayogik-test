// @ts-nocheck
import { Category, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { unslugify } from "@/lib/generateSlug";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  lessons: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId?: string | null;
  title?: string;
  categoryId?: string;
  page?: string;
  category?: string;
  limit?: number;
  search?: string;
  sort?: string;
};

const courseFilters = ({ title, categoryId, category, search }: GetCourses) => {
  const filters: db.CourseWhereInput = {
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
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
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
        purchases: userId
          ? {
              where: {
                studentProfile: {
                  userId: userId, // Use `studentProfile.userId` instead of `userId`
                },
              },
            }
          : undefined,
      },
      orderBy: {
        createdAt: sort,
      },
      take: Number(limit),
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          let progressPercentage = null;

          if (userId && course.purchases.length > 0) {
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

    return { data: coursesWithProgress, meta: { total: totalCourses } };
  } catch (error) {
    console.error("[GET_COURSES]", error);
    return [];
  }
};
