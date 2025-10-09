// // @ts-nocheck
// "use server";
// import { useStudentProfile } from "@/hooks/useStudentProfile";
// import { db } from "@/lib/db";
// import { getServerUserSession } from "@/lib/getServerUserSession";
// import { cache } from "react";

// export const getStudentCourseProgressCompletedCount = cache(async () => {
//   try {
//     const { userId } = await getServerUserSession();

//     if (!userId) {
//       return null;
//     }

//     const studentProfileId = await useStudentProfile(userId);

//     // Get student profile with subscription info
//     const studentProfile = await db.studentProfile.findUnique({
//       where: { id: studentProfileId },
//       select: {
//         subscription: {
//           select: {
//             status: true,
//             expiresAt: true,
//           },
//         },
//       },
//     });

//     // Check if user has active subscription
//     const isSubscriber =
//       studentProfile?.subscription?.status === "ACTIVE" &&
//       new Date(studentProfile.subscription.expiresAt) > new Date();

//     // Get all enrolled courses for the student with their lessons and progress
//     const enrolledCoursesWithProgress = await db.enrolledStudents.findMany({
//       where: {
//         studentProfileId,
//       },
//       include: {
//         course: {
//           select: {
//             id: true,
//             title: true,
//             lessons: {
//               select: {
//                 id: true,
//                 isPublished: true,
//                 Progress: {
//                   where: {
//                     studentProfileId: studentProfileId,
//                   },
//                   select: {
//                     isCompleted: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     let completedCourses = 0;
//     let inProgressCourses = 0;

//     // Process each enrolled course
//     enrolledCoursesWithProgress.forEach((enrolledCourse) => {
//       const { course } = enrolledCourse;

//       // Only count published lessons
//       const publishedLessons = course?.lessons.filter(
//         (lesson) => lesson.isPublished
//       );

//       if (publishedLessons?.length === 0) {
//         // Skip courses with no published lessons
//         return;
//       }

//       // Count completed lessons
//       const completedLessons = publishedLessons?.filter(
//         (lesson) => lesson.Progress.length > 0 && lesson.Progress[0].isCompleted
//       ).length;

//       // Determine course status
//       if (completedLessons === 0) {
//         // No lessons completed - not started (don't count)
//         return;
//       } else if (completedLessons === publishedLessons?.length) {
//         // All lessons completed
//         completedCourses++;
//       } else {
//         // Some lessons completed
//         inProgressCourses++;
//       }
//     });

//     // Get subscription courses progress if user has active subscription
//     let subscriptionCompletedCourses = 0;
//     let subscriptionInProgressCourses = 0;

//     if (isSubscriber) {
//       // Get all subscription courses that are not already purchased
//       const enrolledCourseIds = enrolledCoursesWithProgress.map(
//         (enrolled) => enrolled?.course?.id
//       );

//       const subscriptionCoursesWithProgress = await db.course.findMany({
//         where: {
//           isUnderSubscription: true,
//           isPublished: true,
//           id: {
//             notIn: enrolledCourseIds, // Exclude already purchased courses
//           },
//         },
//         select: {
//           id: true,
//           title: true,
//           lessons: {
//             where: {
//               isPublished: true,
//             },
//             select: {
//               id: true,
//               Progress: {
//                 where: {
//                   studentProfileId: studentProfileId,
//                 },
//                 select: {
//                   isCompleted: true,
//                 },
//               },
//             },
//           },
//         },
//       });

//       // Process each subscription course
//       subscriptionCoursesWithProgress.forEach((course) => {
//         const { lessons } = course;

//         if (lessons.length === 0) {
//           // Skip courses with no published lessons
//           return;
//         }

//         // Count completed lessons
//         const completedLessons = lessons.filter(
//           (lesson) =>
//             lesson.Progress.length > 0 && lesson.Progress[0].isCompleted
//         ).length;

//         // Determine course status
//         if (completedLessons === 0) {
//           // No lessons completed - not started (don't count)
//           return;
//         } else if (completedLessons === lessons.length) {
//           // All lessons completed
//           subscriptionCompletedCourses++;
//         } else {
//           // Some lessons completed
//           subscriptionInProgressCourses++;
//         }
//       });
//     }

//     return {
//       success: true,
//       data: {
//         completedCourses: completedCourses + subscriptionCompletedCourses,
//         inProgressCourses: inProgressCourses + subscriptionInProgressCourses,
//         totalEnrolledCourses: enrolledCoursesWithProgress.length,
//         // Additional breakdown
//         purchasedCoursesStats: {
//           completed: completedCourses,
//           inProgress: inProgressCourses,
//         },
//         subscriptionCoursesStats: {
//           completed: subscriptionCompletedCourses,
//           inProgress: subscriptionInProgressCourses,
//         },
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching student course progress:", error);
//     return {
//       success: false,
//       error: "Failed to fetch course progress",
//     };
//   }
// });

// @ts-nocheck
"use server";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { cache } from "react";

export const getStudentCourseProgressCompletedCount = cache(async () => {
  try {
    const { userId } = await getServerUserSession();

    if (!userId) {
      return null;
    }

    const studentProfileId = await useStudentProfile(userId);

    // Get subscription status and enrolled courses in parallel
    const [studentProfile, enrolledCoursesData] = await Promise.all([
      // Get subscription status
      db.studentProfile.findUnique({
        where: { id: studentProfileId },
        select: {
          subscription: {
            select: {
              status: true,
              expiresAt: true,
            },
          },
        },
      }),

      // Get enrolled courses with progress data
      db.enrolledStudents.findMany({
        where: { studentProfileId },
        select: {
          course: {
            select: {
              id: true,
              lessons: {
                where: { isPublished: true },
                select: {
                  id: true,
                  Progress: {
                    where: {
                      studentProfileId,
                      isCompleted: true,
                    },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    // Check if user has active subscription
    const isSubscriber =
      studentProfile?.subscription?.status === "ACTIVE" &&
      new Date(studentProfile.subscription.expiresAt) > new Date();

    // Process enrolled courses
    const { completed: enrolledCompleted, inProgress: enrolledInProgress } =
      processCourseStats(
        enrolledCoursesData.map((e) => e.course).filter(Boolean)
      );

    let subscriptionCompleted = 0;
    let subscriptionInProgress = 0;

    // Get subscription courses only if user has active subscription
    if (isSubscriber) {
      const enrolledCourseIds = enrolledCoursesData
        .map((enrolled) => enrolled.course?.id)
        .filter(Boolean);

      const subscriptionCourses = await db.course.findMany({
        where: {
          isUnderSubscription: true,
          isPublished: true,
          ...(enrolledCourseIds.length > 0 && {
            id: { notIn: enrolledCourseIds },
          }),
        },
        select: {
          id: true,
          lessons: {
            where: { isPublished: true },
            select: {
              id: true,
              Progress: {
                where: {
                  studentProfileId,
                  isCompleted: true,
                },
                select: { id: true },
              },
            },
          },
        },
      });

      const subscriptionStats = processCourseStats(subscriptionCourses);
      subscriptionCompleted = subscriptionStats.completed;
      subscriptionInProgress = subscriptionStats.inProgress;
    }

    return {
      success: true,
      data: {
        completedCourses: enrolledCompleted + subscriptionCompleted,
        inProgressCourses: enrolledInProgress + subscriptionInProgress,
      },
    };
  } catch (error) {
    console.error("Error fetching student course progress:", error);
    return {
      success: false,
      error: "Failed to fetch course progress",
    };
  }
});

// Helper function to process course statistics
function processCourseStats(courses: any[]) {
  let completed = 0;
  let inProgress = 0;

  courses.forEach((course) => {
    if (!course?.lessons || course.lessons.length === 0) {
      return; // Skip courses with no published lessons
    }

    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter(
      (lesson: any) => lesson.Progress && lesson.Progress.length > 0
    ).length;

    if (completedLessons === 0) {
      // Not started - don't count
      return;
    } else if (completedLessons === totalLessons) {
      // Fully completed
      completed++;
    } else {
      // Some lessons completed - in progress
      inProgress++;
    }
  });

  return { completed, inProgress };
}
