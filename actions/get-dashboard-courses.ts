// actions/get-dashboard-courses.ts
"use server";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { cache } from "react";
import type { Prisma } from "@prisma/client";

type LessonResult = {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  isFree: boolean;
  videoUrl: string | null;
  position: number;
  Progress: Prisma.ProgressGetPayload<true>[];
};

type CourseResult = {
  id: string;
  title: string;
  slug: string;
  totalDuration: number | null;
  imageUrl: string | null;
  isPublished: boolean;
  isUnderSubscription: boolean;
  purchases: Prisma.PurchaseGetPayload<true>[];
  teacherProfile: {
    user: {
      name: string;
    };
  };
  prices: Array<{
    regularAmount: number;
    isFree: boolean;
  }>;
  _count: {
    enrolledStudents: number;
  };
  lessons: LessonResult[];
};

type CourseWithProgress = CourseResult & {
  progress: number | null;
  nextLessonSlug: string | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgress[];
  coursesInProgress: CourseWithProgress[];
  purchasedCourseIds: string[];
};

export const getDashboardCourses = cache(
  async (userId: string): Promise<DashboardCourses> => {
    try {
      // Get the student profile for the user
      const studentProfile = await db.studentProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });

      // Return empty result if student profile doesn't exist
      if (!studentProfile) {
        return {
          completedCourses: [],
          coursesInProgress: [],
          purchasedCourseIds: [],
        };
      }

      // Fetch enrolled courses for the student
      const enrollments = await db.enrolledStudents.findMany({
        where: {
          studentProfileId: studentProfile.id,
          course: {
            isPublished: true,
          },
        },
        select: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              totalDuration: true,
              purchases: true,
              teacherProfile: {
                select: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              imageUrl: true,
              isPublished: true,
              prices: {
                select: {
                  regularAmount: true,
                  isFree: true,
                },
              },
              isUnderSubscription: true,
              _count: {
                select: {
                  enrolledStudents: true,
                },
              },
              lessons: {
                where: {
                  isPublished: true,
                },
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  isPublished: true,
                  isFree: true,
                  videoUrl: true,
                  Progress: true,
                  position: true,
                },
              },
            },
          },
        },
      });

      // Extract course IDs and courses
      const purchasedCourseIds = enrollments
        .filter((item) => item.course !== null)
        .map((item) => item.course!.id);

      const coursesArray = enrollments
        .filter((item) => item.course !== null)
        .map((item) => item.course!);

      let completedCourses: CourseWithProgress[] = [];
      let coursesInProgress: CourseWithProgress[] = [];

      // Calculate progress for each course
      const progressPromises = coursesArray.map(async (course) => {
        const progress = await getProgress(userId, course.id);

        const courseWithProgress: CourseResult & { progress: number | null } = {
          ...course,
          progress,
        };

        if (progress === 100) {
          completedCourses.push(courseWithProgress as CourseWithProgress);
        } else {
          coursesInProgress.push(courseWithProgress as CourseWithProgress);
        }
      });

      await Promise.all(progressPromises);

      // Helper function to add next lesson slug
      const addNextLessonSlug = async (
        course: CourseResult & { progress: number | null }
      ): Promise<CourseWithProgress> => {
        let nextLessonSlug: string | null = null;

        if (course.lessons && course.lessons.length > 0) {
          // Get completed lesson IDs
          const completedLessons = await db.progress.findMany({
            where: {
              studentProfileId: studentProfile.id,
              lesson: {
                courseId: course.id,
                isPublished: true,
              },
              isCompleted: true,
            },
            select: {
              lessonId: true,
            },
          });

          const completedIds = completedLessons.map((item) => item.lessonId);

          // Find the first incomplete lesson
          const nextLesson = await db.lesson.findFirst({
            where: {
              courseId: course.id,
              isPublished: true,
              id: {
                notIn: completedIds,
              },
            },
            orderBy: {
              position: "asc",
            },
            select: {
              slug: true,
            },
          });

          nextLessonSlug = nextLesson?.slug ?? null;

          // If no incomplete lesson found (all completed), get the first lesson
          if (!nextLessonSlug) {
            const firstLesson = await db.lesson.findFirst({
              where: {
                courseId: course.id,
                isPublished: true,
              },
              orderBy: {
                position: "asc",
              },
              select: {
                slug: true,
              },
            });

            nextLessonSlug = firstLesson?.slug ?? null;
          }
        }

        return {
          ...course,
          nextLessonSlug,
        };
      };

      // Process both coursesInProgress and completedCourses
      const processedCoursesInProgress = await Promise.all(
        coursesInProgress.map(addNextLessonSlug)
      );

      const processedCompletedCourses = await Promise.all(
        completedCourses.map(addNextLessonSlug)
      );

      return {
        completedCourses: processedCompletedCourses,
        coursesInProgress: processedCoursesInProgress,
        purchasedCourseIds,
      };
    } catch (error) {
      console.error("[GET_DASHBOARD_COURSES]", error);
      return {
        completedCourses: [],
        coursesInProgress: [],
        purchasedCourseIds: [],
      };
    }
  }
);
