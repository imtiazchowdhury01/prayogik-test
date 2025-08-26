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
  // console.log('roadmaps result:', roadmaps);

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
      updatedAt: roadmaps[0]?.updatedAt // latest based on orderBy
    };
  }
};