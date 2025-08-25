import { Category, Lesson, Course, Purchase } from "@prisma/client";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { cache } from "react";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: Lesson[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
  purchasedCourseIds: string[];
};

export const getDashboardCourses = cache(
  async (userId: string): Promise<DashboardCourses> => {
    try {
      const studentProfileId = await useStudentProfile(userId);
      // Check if studentProfileId is valid
      if(Object.keys(studentProfileId!).length === 0) {
        throw new Error("Student profile not found");
      }
      // Fetch purchased courses for the student
      let purchasedCourseIds: string[] = [];
      const purchases = await db.enrolledStudents.findMany({
        where: {
          studentProfileId,
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

      purchasedCourseIds = purchases
        .filter((item) => item.course !== null)
        .map((item) => item.course.id);

      const coursesArray = purchases
        .filter((item) => item.course !== null)
        .map((item) => item.course);

      let completedCourses: CourseWithProgressWithCategory[] = [];
      let coursesInProgress: CourseWithProgressWithCategory[] = [];

      const progressPromises = coursesArray.map(async (course) => {
        const progress = await getProgress(userId, course.id);

        const courseWithProgress: any = {
          ...course,
          progress,
        };

        if (progress === 100) {
          completedCourses.push(courseWithProgress);
        } else {
          coursesInProgress.push(courseWithProgress);
        }
      });

      await Promise.all(progressPromises);

      // Helper function to process courses and add nextLessonSlug
      const addNextLessonSlug = async (course: any) => {
        let nextLessonSlug = null;

        if (userId && course.lessons && course.lessons.length > 0) {
          const totalLessons = course.lessons.length;

          // Get completed lesson IDs
          const completedLessonIds = await db.progress.findMany({
            where: {
              lesson: {
                courseId: course.id,
                isPublished: true,
              },
              studentProfile: {
                userId,
              },
            },
            select: {
              lessonId: true,
            },
          });

          const completedIds = completedLessonIds.map((item) => item.lessonId);

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

          nextLessonSlug = nextLesson?.slug;

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

            nextLessonSlug = firstLesson?.slug || null;
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
