// actions/get-course-by-slug.ts
"use server";

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { notFound } from "next/navigation";
import { cache } from "react";

/**
 * Helper type that automatically infers the return type of the Prisma query.
 * This ensures the selected fields and the type definition never conflict.
 */
type CourseWithRelations = Awaited<ReturnType<typeof db.course.findUnique>>;

export const getCourseBySlug = cache(
  async (courseSlug: string): Promise<CourseWithRelations | null> => {
    const { userId } = await getServerUserSession();

    try {
      if (!courseSlug) {
        throw new Error("Failed to fetch the course. Missing course slug.");
      }

      // Fetch student profile for the logged-in user
      const studentProfile = userId
        ? await db.studentProfile.findUnique({
            where: { userId },
            select: { id: true },
          })
        : null;

      const course = await db.course.findUnique({
        where: {
          slug: courseSlug,
          isPublished: true,
        },
        include: {
          purchases: studentProfile
            ? {
                where: { studentProfileId: studentProfile.id },
              }
            : true,
          lessons: {
            where: { isPublished: true },
            include: {
              Progress: studentProfile
                ? {
                    where: { studentProfileId: studentProfile.id },
                  }
                : true,
            },
            orderBy: { position: "asc" },
          },
          prices: true,
          enrolledStudents: {
            select: { studentProfileId: true },
          },
          attachments: true,
          review: {
            include: {
              studentProfile: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      email: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
          },
          teacherProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                  bio: true,
                },
              },
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
                  username: true,
                  avatarUrl: true,
                  teacherProfile: {
                    select: {
                      yearsOfExperience: true,
                      subjectSpecializations: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!course) {
        return null;
      }

      return course;
    } catch (error: any) {
      console.error("[GET_COURSE_BY_SLUG]", error);
      return null;
    }
  }
);

export const getCourseByCourseIdForPreview = cache(
  async (courseId: string): Promise<CourseWithRelations | null> => {
    try {
      if (!courseId) {
        throw new Error("Failed to fetch the course. Missing course ID.");
      }

      const course = await db.course.findUnique({
        where: {
          id: courseId,
        },
        include: {
          purchases: true,
          lessons: {
            where: { isPublished: true },
            include: {
              Progress: true,
            },
            orderBy: { position: "asc" },
          },
          prices: true,
          enrolledStudents: {
            select: { studentProfileId: true },
          },
          attachments: true,
          review: {
            include: {
              studentProfile: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      email: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
          },
          teacherProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                  bio: true,
                },
              },
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
                  username: true,
                  avatarUrl: true,
                  teacherProfile: {
                    select: {
                      yearsOfExperience: true,
                      subjectSpecializations: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!course) {
        notFound();
      }

      return course;
    } catch (error) {
      console.error("[GET_COURSE_BY_COURSE_ID_FOR_PREVIEW]", error);
      notFound();
    }
  }
);
