"use server";
import { cache } from "react";
import { db } from "../db";

export const getCourseDBCall = cache(async (slug: string) => {
  const course = await db.course.findFirst({
    where: {
      slug: slug,
      isPublished: true,
    },

    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
      prices: true,
      enrolledStudents: {
        select: { studentProfileId: true },
      },
      attachments: true,
      review: {
        select: {
          content: true,
          studentProfile: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          course: {
            select: {
              title: true,
            },
          },
        },
      },
      teacherProfile: {
        include: {
          user: true,
        },
      },
      category: true,
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
    },
  });
  return course;
});

export const getAllCoursesSlugsDBCall = cache(async () => {
  const courseSlugs = await db.course.findMany({
    select: { slug: true },
    where: { isPublished: true },
  });

  return courseSlugs;
});

// Course filter utility function
const courseFilters = ({
  title,
  category,
  teacherSlug,
}: {
  title?: string;
  category?: string;
  teacherSlug?: string;
}) => {
  const filters: any = {
    isPublished: true,
  };

  if (title) {
    filters.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (category) {
    filters.category = {
      slug: category,
    };
  }

  if (teacherSlug) {
    filters.teacherProfile = {
      user: {
        username: {
          equals: teacherSlug,
          mode: "insensitive",
        },
      },
    };
  }

  return filters;
};

export async function getCoursesDbCall({
  page = 1,
  limit = 10,
  title,
  category,
  teacherSlug,
  sort = "desc",
}: {
  page?: number;
  limit?: number;
  title?: string;
  category?: string;
  teacherSlug?: string;
  sort?: "asc" | "desc";
}) {
  // Validate and sanitize inputs
  page = isNaN(page) || page < 1 ? 1 : page;
  limit = limit > 50 ? 10 : limit;
  const skip = (page - 1) * limit;

  // Apply the filters
  const filters = courseFilters({ title, category, teacherSlug });
  const whereClause = filters;

  // Fetch paginated courses
  const courses = await db.course.findMany({
    where: whereClause,
    orderBy: { updatedAt: sort },
    skip,
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      totalDuration: true,
      isUnderSubscription: true,
      lessons: {
        where: {
          isFree: true,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          position: true,
          videoUrl: true,
          videoStatus: true,
          isFree: true,
          isPublished: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          lessons: {
            where: { isPublished: true },
          },
          enrolledStudents: true,
        },
      },
      teacherProfile: {
        select: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
      imageUrl: true,
      prices: true,
    },
  });

  // Get total count for pagination
  const totalCourses = await db.course.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalCourses / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    courses,
    pagination: {
      page,
      limit,
      totalCourses,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
}

export const getPrimeCoursesDBCall = async (page: number = 1) => {
  const skip = page === 1 ? 0 : 24 + (page - 2) * 6;
  const take = page === 1 ? 24 : 6;

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      isUnderSubscription: true,
    },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
      prices: true,
      enrolledStudents: {
        select: { studentProfileId: true },
      },
      attachments: true,
      review: {
        select: {
          content: true,
          studentProfile: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          course: {
            select: {
              title: true,
            },
          },
        },
      },
      teacherProfile: {
        include: {
          user: true,
        },
      },
      category: true,
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
    },
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  return courses;
};

// Add this to your course data access layer file
export const getPrimeCoursesByCategoryDBCall = async (
  categorySlug: string,
  page: number = 1
) => {
  const skip = page === 1 ? 0 : 24 + (page - 2) * 6;

  const take = page === 1 ? 24 : 6;
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      isUnderSubscription: true,
      category: {
        slug: categorySlug,
      },
    },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
      prices: true,
      enrolledStudents: {
        select: { studentProfileId: true },
      },
      attachments: true,
      review: {
        select: {
          content: true,
          studentProfile: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          course: {
            select: {
              title: true,
            },
          },
        },
      },
      teacherProfile: {
        include: {
          user: true,
        },
      },
      category: true,
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
    },
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  return courses;
};
