// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";

import { isTeacher } from "@/lib/teacher";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { getUserSubscription } from "@/lib/getUserSubscription";
import { RouteHandler } from "@/lib/utils/server/route-handler";
import { z } from "zod";
import { Role, DifficultyLevel } from "@prisma/client";

const routeHandler = new RouteHandler();
routeHandler.addRoute(
  z.object({
    title: z.string(),
    slug: z.string(),
  }),
  async (req, body) => {
    const { userId } = await getServerUserSession(req);
    if (!userId || !isTeacher(userId)) {
      throw new Error("Unauthorised Access");
    }

    const { title, slug } = body;

    const teacherProfile = await db.teacherProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!teacherProfile) {
      throw new Error("Teacher profile not found");
    }

    const certification = await db.certification.create({
      data: {
        teacherProfileId: teacherProfile.id,
        title,
        slug,
      },
    });

    return certification;
  },
  "POST",
  [Role.TEACHER, Role.ADMIN]
);

// Certification filter utility function
const certificationFilters = ({
  title,
  level,
  teacherSlug,
  skillId,
  isPublished,
}: {
  title?: string;
  level?: DifficultyLevel;
  teacherSlug?: string;
  skillId?: string;
  isPublished?: boolean;
}) => {
  const filters: any = {};

  if (isPublished) {
    filters.isPublished = isPublished;
  }

  if (title) {
    filters.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (level) {
    filters.level = level;
  }

  if (teacherSlug) {
    filters.teacherProfile = {
      user: {
        username: {
          equals: teacherSlug,
          mode: "insensitive",
        },
      },
    };
  }

  if (skillId) {
    filters.skillIds = {
      has: skillId,
    };
  }

  return filters;
};

export async function GET(req: Request) {
  const { userId, role, isAdmin } = await getServerUserSession();

  try {
    const url = new URL(req.url);
    let page = parseInt(url.searchParams.get("page") || "1", 10);
    page = isNaN(page) || page < 1 ? 1 : page;
    const limit =
      parseInt(url.searchParams.get("limit") || "10") > 50
        ? 10
        : parseInt(url.searchParams.get("limit") || "10");
    const title = url.searchParams.get("title") || undefined;
    const level =
      (url.searchParams.get("level") as DifficultyLevel) || undefined;
    const teacherSlug = url.searchParams.get("teacher") || undefined;
    const skillId = url.searchParams.get("skill") || undefined;

    const sort = url.searchParams.get("sort") === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;

    // Apply the filters
    const filters = certificationFilters({
      title,
      level,
      teacherSlug,
      skillId,
      isPublished: isAdmin ? undefined : true,
    });

    // Get purchased certification IDs for logged-in user
    let purchasedCertificationIds: string[] = [];

    if (userId) {
      const studentProfileId = await useStudentProfile(userId);
      const purchases = await db.purchase.findMany({
        where: {
          studentProfileId,
          certificationId: { not: null },
          certification: {
            isPublished: true,
          },
        },
        select: {
          certificationId: true,
        },
      });
      purchasedCertificationIds = purchases
        .map((p) => p.certificationId)
        .filter((id): id is string => id !== null);
    }

    const whereClause = filters;

    // Fetch paginated certifications
    const certifications = await db.certification.findMany({
      where: whereClause,
      orderBy: { updatedAt: sort },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        description: true,
        level: true,
        learningOutcomes: true,
        whofor: true,
        imageUrl: true,
        isPublished: true,
        skills: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        courses: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            totalDuration: true,
            _count: {
              select: {
                lessons: {
                  where: { isPublished: true },
                },
              },
            },
          },
        },
        teacherProfile: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                username: true,
              },
            },
          },
        },
        coTeachers: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        prices: true,
        purchases: userId
          ? {
              where: {
                studentProfile: {
                  userId,
                },
              },
            }
          : undefined,
      },
    });

    const processedCertifications = await Promise.all(
      certifications.map(async (certification) => {
        const isPurchased = purchasedCertificationIds.includes(
          certification.id
        );

        // Calculate certification progress if purchased
        let progress = null;
        let completedCoursesCount = 0;

        if (userId && isPurchased && certification.courses.length > 0) {
          // Get student's enrolled courses that are part of this certification
          const studentProfileId = await useStudentProfile(userId);
          const enrolledCertificationCourses =
            await db.enrolledStudents.findMany({
              where: {
                studentProfileId,
                courseId: {
                  in: certification.courses.map((c) => c.id),
                },
              },
              select: {
                courseId: true,
              },
            });

          const enrolledCourseIds = enrolledCertificationCourses.map(
            (e) => e.courseId
          );

          // Count completed courses (100% progress)
          for (const courseId of enrolledCourseIds) {
            const totalLessons = await db.lesson.count({
              where: {
                courseId,
                isPublished: true,
              },
            });

            if (totalLessons > 0) {
              const completedLessons = await db.progress.count({
                where: {
                  isCompleted: true,
                  lesson: {
                    courseId,
                    isPublished: true,
                  },
                  studentProfile: {
                    userId,
                  },
                },
              });

              if (completedLessons >= totalLessons) {
                completedCoursesCount++;
              }
            }
          }

          if (certification.courses.length > 0) {
            progress = Math.ceil(
              (completedCoursesCount / certification.courses.length) * 100
            );
          }
        }

        return {
          ...certification,
          progress,
          completedCoursesCount,
          totalCoursesCount: certification.courses.length,
          isPurchased,
        };
      })
    );

    const totalCertifications = await db.certification.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCertifications / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      certifications: processedCertifications,
      pagination: {
        page,
        limit,
        totalCertifications,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch certifications." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return routeHandler.handle(req);
}
