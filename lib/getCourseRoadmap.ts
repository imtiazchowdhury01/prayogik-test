// "use server";

// import { CourseRoadmap, CourseRoadmapStatus } from "@prisma/client";
// import { db } from "./db";


// export const getCourseRoadmap = async (section: "HERO" | "ROADMAP") => {
//   const roadmaps =  await db.courseRoadmap.findMany({
//         include: {
//           teacher: {
//             select: {
//               user: {
//                 select: {
//                   name: true,
//                   avatarUrl: true,
//                   email: true,
//                 },
//               },
//             },
//           },
          
//         },
//         orderBy: {
//           updatedAt: "desc",
//         },
//       });


//   const plannedCourses = roadmaps.filter(
//     (r: CourseRoadmap) => r.status === CourseRoadmapStatus.PLANNED
//   ) || [];
//   const liveNowCourses = roadmaps.filter(
//     (r: CourseRoadmap) => r.status === CourseRoadmapStatus.COMPLETED
//   ) || [];
//   const wipCourses = roadmaps.filter(
//     (r: CourseRoadmap) => r.status === CourseRoadmapStatus.IN_PROGRESS
//   ) || [];

//   // Get first course from each section
//   const firstLiveCourse = liveNowCourses.reduce((latest, current) => {
//     return new Date(current.createdAt) > new Date(latest.createdAt)
//       ? current
//       : latest;
//   });
//   const firstWipCourse = wipCourses.reduce((latest, current) => {
//     return new Date(current.createdAt) > new Date(latest.createdAt)
//       ? current
//       : latest;
//   });
//   const firstPlannedCourse = plannedCourses.reduce((latest, current) => {
//     return new Date(current.createdAt) > new Date(latest.createdAt)
//       ? current
//       : latest;
//   });

//   if (section === "HERO") {
//     return {
//       firstLiveCourse,
//       firstWipCourse,
//       firstPlannedCourse,
//     };
//   } else {
//     // Exclude the first course from the lists
//     const filteredLiveCourses = liveNowCourses;
//     const filteredWipCourses = wipCourses;
//     const filteredPlannedCourses = plannedCourses;

//     return {
//       liveNowCourses: filteredLiveCourses,
//       wipCourses: filteredWipCourses,
//       plannedCourses: filteredPlannedCourses,
//     };
//   }
// };

"use server";

import { CourseRoadmap, CourseRoadmapStatus } from "@prisma/client";
import { db } from "./db";

export const getCourseRoadmap = async (section: "HERO" | "ROADMAP") => {
  const roadmaps = await db.courseRoadmap.findMany({
    include: {
      teacher: {
        select: {
          user: {
            select: {
              name: true,
              avatarUrl: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const plannedCourses = roadmaps.filter(
    (r: CourseRoadmap) => r.status === CourseRoadmapStatus.PLANNED
  ) || [];
  const liveNowCourses = roadmaps.filter(
    (r: CourseRoadmap) => r.status === CourseRoadmapStatus.COMPLETED
  ) || [];
  const wipCourses = roadmaps.filter(
    (r: CourseRoadmap) => r.status === CourseRoadmapStatus.IN_PROGRESS
  ) || [];

  if (section === "HERO") {
    return {
      liveNowCount: liveNowCourses.length,
      wipCount: wipCourses.length,
      plannedCount: plannedCourses.length,
    };
  } else {
    return {
      liveNowCourses,
      wipCourses,
      plannedCourses,
    };
  }
};