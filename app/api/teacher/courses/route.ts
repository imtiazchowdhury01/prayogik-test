import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

// Course filter utility function
const courseFilters = ({
  title,
  category,
}: {
  title?: string;
  category?: string;
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

  return filters;
};

// export async function GET(req: Request) {
//   const { userId, role } = await getServerUserSession();

//   if (!userId) {
//     return NextResponse.json(
//       { error: true, message: "Unauthorized access." },
//       { status: 401 }
//     );
//   }
//   // Fetch the teacher profile using the provided userId
//   const teacherProfile = await db.teacherProfile.findUnique({
//     where: {
//       userId: userId,
//     },
//   });
//   const teacherProfileId = teacherProfile?.id;

//   if (!teacherProfileId) {
//     return NextResponse.json(
//       { error: true, message: "Teacher profile not found." },
//       { status: 404 }
//     );
//   }
//   try {
//     // Extract query parameters
//     const url = new URL(req.url);
//     let page = parseInt(url.searchParams.get("page") || "1", 10);
//     page = isNaN(page) || page < 1 ? 1 : page;
//     const limit =
//       parseInt(url.searchParams.get("limit") || "10") > 50
//         ? 10
//         : parseInt(url.searchParams.get("limit") || "10");
//     const title = url.searchParams.get("title") || undefined;
//     const category = url.searchParams.get("category") || undefined;
//     const sort = url.searchParams.get("sort") === "asc" ? "asc" : "desc";

//     // Calculate skip value for pagination
//     const skip = (page - 1) * limit;

//     // Apply filters
//     // Initialize base filters
//     let baseFilters: any = {
//       teacherProfile: {
//         userId,
//       },
//     };

//     const filters = {
//       ...baseFilters,
//       ...courseFilters({ title, category }),
//     };

//     // // Get paginated courses
//     // const courses = await db.course.findMany({
//     //   where: {
//     //     ...filters,
//     //   },
//     //   select: {
//     //     id: true,
//     //     title: true,
//     //     slug: true,
//     //     totalDuration: true,
//     //     isUnderSubscription: true,
//     //     lessons: {
//     //       where: {
//     //         isFree: true,
//     //         isPublished: true,
//     //       },
//     //       select: {
//     //         id: true,
//     //         title: true,
//     //         slug: true,
//     //         position: true,
//     //         videoUrl: true,
//     //         isFree: true,
//     //         isPublished: true,
//     //       },
//     //     },
//     //     category: {
//     //       select: {
//     //         name: true,
//     //         slug: true,
//     //       },
//     //     },
//     //     _count: {
//     //       select: {
//     //         lessons: {
//     //           where: { isPublished: true },
//     //         },
//     //         enrolledStudents: true,
//     //       },
//     //     },
//     //     teacherProfile: {
//     //       select: {
//     //         user: {
//     //           select: { name: true, email: true },
//     //         },
//     //       },
//     //     },
//     //     imageUrl: true,
//     //     prices: {
//     //       select: {
//     //         regularAmount: true,
//     //         discountedAmount: true,
//     //         discountExpiresOn: true,
//     //       },
//     //     },
//     //     purchases: userId
//     //       ? {
//     //           where: {
//     //             studentProfile: {
//     //               userId,
//     //             },
//     //           },
//     //         }
//     //       : undefined,
//     //     // rating: {
//     //     //   select: {
//     //     //     studentProfile: {
//     //     //       select: {
//     //     //         user: {
//     //     //           select: {
//     //     //             name: true,
//     //     //           },
//     //     //         },
//     //     //       },
//     //     //     },
//     //     //     value: true,
//     //     //   },
//     //     // },
//     //     // review: {
//     //     //   select: {
//     //     //     studentProfile: {
//     //     //       select: {
//     //     //         user: {
//     //     //           select: {
//     //     //             name: true,
//     //     //           },
//     //     //         },
//     //     //       },
//     //     //     },
//     //     //     content: true,
//     //     //   },
//     //     // },
//     //   },
//     //   orderBy: { createdAt: sort },
//     //   skip,
//     //   take: limit,
//     // });

//     const courses = await db.course.findMany({
//       where: {
//         OR: [
//           { teacherProfileId: teacherProfileId },
//           {
//             coTeacherIds: {
//               hasSome: [teacherProfileId],
//             },
//           },
//         ],
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         prices: true,
//         category: true,
//         enrolledStudents: true,
//         teacherProfile: {
//           select: {
//             user: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     // Process courses to add progress and nextLessonSlug
//     const processedCourses = await Promise.all(
//       courses.map(async (course) => {
//         let progress = null;
//         let nextLessonSlug = null;

//         // Only process progress if user is logged in and has purchased the course
//         if (userId && course.purchases && course.purchases.length > 0) {
//           // Get total number of lessons
//           const totalLessons = course._count.lessons;

//           // Get completed lessons count from Progress table
//           const completedLessonsCount = await db.progress.count({
//             where: {
//               lesson: {
//                 courseId: course.id,
//                 isPublished: true,
//               },
//               studentProfile: {
//                 userId,
//               },
//             },
//           });

//           // Calculate progress percentage
//           if (totalLessons > 0) {
//             progress = Math.ceil((completedLessonsCount / totalLessons) * 100);
//           }

//           // Find the next lesson to complete (first incomplete lesson)
//           if (completedLessonsCount < totalLessons) {
//             // Get all lesson IDs that the user has completed
//             const completedLessonIds = await db.progress.findMany({
//               where: {
//                 lesson: {
//                   courseId: course.id,
//                   isPublished: true,
//                 },
//                 studentProfile: {
//                   userId,
//                 },
//               },
//               select: {
//                 lessonId: true,
//               },
//             });

//             const completedIds = completedLessonIds.map(
//               (item) => item.lessonId
//             );

//             // Find the first lesson that isn't in the completed list
//             const nextLesson = await db.lesson.findFirst({
//               where: {
//                 courseId: course.id,
//                 isPublished: true,
//                 id: {
//                   notIn: completedIds,
//                 },
//               },
//               orderBy: {
//                 position: "asc",
//               },
//               select: {
//                 slug: true,
//               },
//             });

//             if (nextLesson) {
//               nextLessonSlug = nextLesson.slug;
//             } else if (totalLessons > 0) {
//               // If all lessons are completed (should not happen in this logic but just as a fallback)
//               const firstLesson = await db.lesson.findFirst({
//                 where: {
//                   courseId: course.id,
//                   isPublished: true,
//                 },
//                 orderBy: {
//                   position: "asc",
//                 },
//                 select: {
//                   slug: true,
//                 },
//               });

//               if (firstLesson) {
//                 nextLessonSlug = firstLesson.slug;
//               }
//             }
//           } else if (totalLessons > 0) {
//             // If all lessons are completed, set next lesson to first lesson
//             const firstLesson = await db.lesson.findFirst({
//               where: {
//                 courseId: course.id,
//                 isPublished: true,
//               },
//               orderBy: {
//                 position: "asc",
//               },
//               select: {
//                 slug: true,
//               },
//             });

//             if (firstLesson) {
//               nextLessonSlug = firstLesson.slug;
//             }
//           }
//         }

//         return {
//           ...course,
//           progress,
//           nextLessonSlug,
//         };
//       })
//     );

//     // Get total count for pagination metadata
//     const totalCourses = await db.course.count({
//       where: filters,
//     });

//     // Calculate pagination metadata
//     const totalPages = Math.ceil(totalCourses / limit);
//     const hasNextPage = page < totalPages;
//     const hasPrevPage = page > 1;

//     return NextResponse.json({
//       courses: processedCourses,
//       pagination: {
//         page,
//         limit,
//         totalCourses,
//         totalPages,
//         hasNextPage,
//         hasPrevPage,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     return NextResponse.json(
//       { error: true, message: "Failed to fetch courses." },
//       { status: 500 }
//     );
//   }
// }

/**
 * GET handler to fetch paginated and filtered courses for an authenticated teacher.
 * 
 * @param req - The incoming HTTP request
 * @returns JSON response containing a list of courses and pagination metadata,
 *          or an error message with appropriate HTTP status codes
 */
export async function GET(req: Request) {
  // Get the authenticated user session
  const { userId } = await getServerUserSession();

  // Reject request if user is not authenticated
  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Retrieve the teacher profile associated with the authenticated user
  const teacherProfile = await db.teacherProfile.findUnique({
    where: { userId },
  });
  const teacherProfileId = teacherProfile?.id;

  // Reject request if teacher profile is not found
  if (!teacherProfileId) {
    return NextResponse.json(
      { error: true, message: "Teacher profile not found." },
      { status: 404 }
    );
  }

  try {
    // Extract query parameters for pagination and filtering
    const url = new URL(req.url);
    let page = parseInt(url.searchParams.get("page") || "1", 10);
    page = isNaN(page) || page < 1 ? 1 : page;

    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
    const title = url.searchParams.get("title") || undefined;
    const category = url.searchParams.get("category") || undefined;

    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    // Build filter object for courses
    const baseFilters: any = {
      teacherProfile: { userId },
    };
    const filters = {
      ...baseFilters,
      ...courseFilters({ title, category }),
    };

    // Fetch courses where user is teacher or co-teacher
    const courses = await db.course.findMany({
      where: {
        OR: [
          { teacherProfileId },
          { coTeacherIds: { hasSome: [teacherProfileId] } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        prices: true,
        category: true,
        enrolledStudents: true,
        teacherProfile: {
          select: {
            user: { select: { name: true } },
          },
        },
      },
    });

    // Count total courses matching filters (used for pagination)
    const totalCourses = await db.course.count({ where: filters });

    // Compute pagination metadata
    const totalPages = Math.ceil(totalCourses / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Return course data with pagination info
    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        totalCourses,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}

