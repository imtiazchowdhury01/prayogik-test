import { db } from "../db";

async function getCategoriesDBCall() {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        parentCategoryId: true,
        isChild: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            courses: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Error categories db call:", error);
    return [];
  }
}

async function getCategoryCoursesDBCall(slug: string, page: number = 1, pageSize: number = 24) {
  try {
    const skip = page === 1 ? 0 : 24 + (page - 2) * 6; // First page: 24, subsequent pages: 6 each
    const take = page === 1 ? 24 : 6;

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        category: {
          slug,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        totalDuration: true,
        isUnderSubscription: true,
        courseMode: true,
        courseType: true,
        courseLiveLinkScheduledAt: true,
        courseLiveLink: true,
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
        createdAt: true,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return courses;
  } catch (error) {
    console.error("Error categories db call:", error);
    return [];
  }
}

async function getCategoryCoursesCountDBCall(slug: string): Promise<number> {
  try {
    const count = await db.course.count({
      where: {
        isPublished: true,
        category: {
          slug,
        },
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting category courses count:", error);
    return 0;
  }
}

export {
  getCategoriesDBCall,
  getCategoryCoursesDBCall,
  getCategoryCoursesCountDBCall,
};
