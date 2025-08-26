import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getCourseBySlug = cache(
  async (courseSlug: string, userId: string) => {
    try {
      if (!courseSlug) {
        throw new Error("Failed to fetch the course. Missing course slug.");
      }

      // Fetch the student profile for the given userId
      const studentProfile = userId
        ? await db.studentProfile.findUnique({
            where: { userId },
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
            : false,
          lessons: {
            where: { isPublished: true },
            include: studentProfile
              ? {
                  Progress: {
                    where: { studentProfileId: studentProfile.id },
                  },
                }
              : null,
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
                  user: true,
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

      if (!course) {
        throw new Error("Course not found.");
      }

      // Safeguard against enrolledStudents being empty
      course.enrolledStudents = course.enrolledStudents || [];

      return course;
    } catch (error: any) {
      notFound();
    }
  }
);

export const getCourseByCourseIdForPreview = cache(async (courseId: string) => {
  try {
    if (!courseId) {
      throw new Error("Failed to fetch the course. Missing course slug.");
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
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
          include: {
            studentProfile: {
              include: {
                user: true,
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

    if (!course) {
      throw new Error("Course not found.");
    }

    // Safeguard against enrolledStudents being empty
    course.enrolledStudents = course.enrolledStudents || [];

    return course;
  } catch (error) {
    notFound();
  }
});
