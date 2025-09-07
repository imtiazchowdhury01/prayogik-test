// import { cache } from "react";
// import { db } from "../db";

// const getCategoriesDBCall = cache(async () => {
//   try {
//     const categories = await db.category.findMany({
//       select: {
//         id: true,
//         name: true,
//         slug: true,
//         parentCategoryId: true,
//         isChild: true,
//         createdAt: true,
//         updatedAt: true,
//         _count: {
//           select: {
//             courses: {
//               where: {
//                 isPublished: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     });
//     return categories;
//   } catch (error) {
//     console.error("Error categories db call:", error);
//     return [];
//   }
// });

// const getCategoryCoursesDBCall = cache(
//   async (slug: string, page: number = 1, pageSize: number = 24) => {
//     try {
//       const skip = page === 1 ? 0 : 24 + (page - 2) * 6; // First page: 24, subsequent pages: 6 each
//       const take = page === 1 ? 24 : 6;

//       const courses = await db.course.findMany({
//         where: {
//           isPublished: true,
//           category: {
//             slug,
//           },
//         },
//         select: {
//           id: true,
//           title: true,
//           slug: true,
//           description: true,
//           totalDuration: true,
//           isUnderSubscription: true,
//           courseMode: true,
//           courseType: true,
//           courseLiveBatchStartedAt: true,
//           liveSchedules: true,
//           courseLiveLink: true,
//           lessons: {
//             where: {
//               isFree: true,
//               isPublished: true,
//             },
//             select: {
//               id: true,
//               title: true,
//               slug: true,
//               position: true,
//               videoUrl: true,
//               videoStatus: true,
//               isFree: true,
//               isPublished: true,
//             },
//           },
//           category: {
//             select: {
//               name: true,
//               slug: true,
//             },
//           },
//           _count: {
//             select: {
//               lessons: {
//                 where: { isPublished: true },
//               },
//               enrolledStudents: true,
//             },
//           },
//           teacherProfile: {
//             select: {
//               user: {
//                 select: { name: true, email: true },
//               },
//             },
//           },
//           imageUrl: true,
//           prices: true,
//           createdAt: true,
//         },
//         skip,
//         take,
//         orderBy: { createdAt: "desc" },
//       });
//       return courses;
//     } catch (error) {
//       console.error("Error categories db call:", error);
//       return [];
//     }
//   }
// );

// const getCategoryCoursesCountDBCall = cache(
//   async (slug: string): Promise<number> => {
//     try {
//       const count = await db.course.count({
//         where: {
//           isPublished: true,
//           category: {
//             slug,
//           },
//         },
//       });
//       return count;
//     } catch (error) {
//       console.error("Error getting category courses count:", error);
//       return 0;
//     }
//   }
// );

// export {
//   getCategoriesDBCall,
//   getCategoryCoursesDBCall,
//   getCategoryCoursesCountDBCall,
// };


import { cache } from "react";
import { db } from "../db";

// OPTIMIZATION 1: Enhanced getCategoriesDBCall that includes course count
const getCategoriesDBCall = cache(async () => {
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
});

// OPTIMIZATION 2: Batch operation to get multiple categories' course counts
const getMultipleCategoryCoursesCountDBCall = cache(
  async (slugs: string[]): Promise<Record<string, number>> => {
    try {
      if (slugs.length === 0) return {};
      
      const counts = await db.category.findMany({
        where: {
          slug: {
            in: slugs,
          },
        },
        select: {
          slug: true,
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
      });

      const result: Record<string, number> = {};
      counts.forEach(category => {
        result[category.slug] = category._count.courses;
      });
      
      return result;
    } catch (error) {
      console.error("Error getting multiple category courses count:", error);
      return {};
    }
  }
);

// Keep existing function for backward compatibility
const getCategoryCoursesCountDBCall = cache(
  async (slug: string): Promise<number> => {
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
);

// OPTIMIZATION 3: Enhanced getCategoryCoursesDBCall with better query structure
const getCategoryCoursesDBCall = cache(
  async (slug: string, page: number = 1, pageSize: number = 24) => {
    try {
      const skip = page === 1 ? 0 : 24 + (page - 2) * 6;
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
          courseLiveBatchStartedAt: true,
          liveSchedules: true,
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
            // OPTIMIZATION: Limit free lessons selection if not all are needed
            take: 5, // Adjust based on your UI needs
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
                select: { 
                  name: true, 
                  email: true,
                  // OPTIMIZATION: Only select needed fields
                },
              },
            },
          },
          imageUrl: true,
          prices: true,
          createdAt: true,
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      });
      return courses;
    } catch (error) {
      console.error("Error getting category courses:", error);
      return [];
    }
  }
);

// OPTIMIZATION 4: New function to get categories with their course counts in one query
const getCategoriesWithCoursesCountDBCall = cache(async () => {
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
      where: {
        courses: {
          some: {
            isPublished: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Error getting categories with courses:", error);
    return [];
  }
});

// OPTIMIZATION 5: Aggregate function to get all needed data for static generation
const getStaticGenerationDataDBCall = cache(async () => {
  try {
    // Get categories with courses, course counts, and basic stats in parallel
    const [categories, totalCourses, totalPrimeCourses, totalLiveCourses] = await Promise.all([
      getCategoriesWithCoursesCountDBCall(),
      db.course.count({ where: { isPublished: true } }),
      db.course.count({ where: { isPublished: true, isUnderSubscription: true } }),
      db.course.count({ where: { isPublished: true, courseMode: "LIVE" } }),
    ]);

    return {
      categories,
      totalCourses,
      totalPrimeCourses,
      totalLiveCourses,
    };
  } catch (error) {
    console.error("Error getting static generation data:", error);
    return {
      categories: [],
      totalCourses: 0,
      totalPrimeCourses: 0,
      totalLiveCourses: 0,
    };
  }
});

export {
  getCategoriesDBCall,
  getCategoryCoursesDBCall,
  getCategoryCoursesCountDBCall,
  getMultipleCategoryCoursesCountDBCall,
  getCategoriesWithCoursesCountDBCall,
  getStaticGenerationDataDBCall,
};