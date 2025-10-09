// api/certifications/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { RouteHandler } from "@/lib/utils/server/route-handler";
import { z } from "zod";
import { Role, DifficultyLevel } from "@prisma/client";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface CertificationFilters {
  title?: string;
  level?: DifficultyLevel;
  teacherSlug?: string;
  skillId?: string;
  isPublished?: boolean;
}

interface CreateCertificationRequest {
  title: string;
  slug: string;
}

interface PaginationParams {
  page: number;
  limit: number;
  totalCertifications: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

type CertificationWithDetails = Prisma.CertificationGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    excerpt: true;
    description: true;
    level: true;
    learningOutcomes: true;
    whofor: true;
    imageUrl: true;
    isPublished: true;
    skills: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    courses: {
      select: {
        id: true;
        title: true;
        slug: true;
        imageUrl: true;
        totalDuration: true;
        _count: {
          select: {
            lessons: true;
          };
        };
      };
    };
    teacherProfile: {
      select: {
        user: {
          select: {
            name: true;
            email: true;
            username: true;
          };
        };
      };
    };
    coTeachers: {
      select: {
        user: {
          select: {
            name: true;
            username: true;
          };
        };
      };
    };
    prices: true;
    purchases: true;
  };
}>;

interface ProcessedCertification extends CertificationWithDetails {
  progress: number | null;
  completedCoursesCount: number;
  totalCoursesCount: number;
  isPurchased: boolean;
}

// ========== ROUTE HANDLER SETUP ==========

const routeHandler = new RouteHandler();

routeHandler.addRoute(
  z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
  }),
  async (req, body) => {
    const { userId } = await getServerUserSession();

    if (!userId) {
      throw new Error("Unauthorized Access");
    }

    const userIsTeacher = await isTeacher(userId);

    if (!userIsTeacher) {
      throw new Error("Unauthorized Access");
    }

    const { title, slug } = body as CreateCertificationRequest;

    const teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!teacherProfile) {
      throw new Error("Teacher profile not found");
    }

    // Check if slug already exists
    const existingCertification = await db.certification.findUnique({
      where: { slug },
    });

    if (existingCertification) {
      throw new Error("Certification with this slug already exists");
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

// ========== HELPER FUNCTIONS ==========

const certificationFilters = ({
  title,
  level,
  teacherSlug,
  skillId,
  isPublished,
}: CertificationFilters): Prisma.CertificationWhereInput => {
  const filters: Prisma.CertificationWhereInput = {};

  if (isPublished !== undefined) {
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

// ========== GET HANDLER ==========

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, isAdmin } = await getServerUserSession();

    const url = new URL(req.url);
    let page = parseInt(url.searchParams.get("page") || "1", 10);
    page = isNaN(page) || page < 1 ? 1 : page;

    const limitParam = parseInt(url.searchParams.get("limit") || "10", 10);
    const limit = limitParam > 50 ? 10 : limitParam;

    const title = url.searchParams.get("title") || undefined;
    const level =
      (url.searchParams.get("level") as DifficultyLevel) || undefined;
    const teacherSlug = url.searchParams.get("teacher") || undefined;
    const skillId = url.searchParams.get("skill") || undefined;

    const sort = url.searchParams.get("sort") === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;

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

      if (studentProfileId) {
        const purchases = await db.purchase.findMany({
          where: {
            studentProfileId,
            certificationId: { not: null },
            paymentStatus: "COMPLETED",
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
    }

    const certifications = await db.certification.findMany({
      where: filters,
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
                studentProfile: { userId },
                paymentStatus: "COMPLETED",
              },
            }
          : false,
      },
    });

    const processedCertifications: ProcessedCertification[] = await Promise.all(
      certifications.map(async (certification) => {
        const isPurchased = purchasedCertificationIds.includes(
          certification.id
        );

        let progress: number | null = null;
        let completedCoursesCount = 0;

        if (userId && isPurchased && certification.courses.length > 0) {
          const studentProfileId = await useStudentProfile(userId);

          if (studentProfileId) {
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

            for (const courseId of enrolledCourseIds) {
              if (!courseId) continue;

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
                    studentProfile: { userId },
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
      where: filters,
    });

    const totalPages = Math.ceil(totalCertifications / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const pagination: PaginationParams = {
      page,
      limit,
      totalCertifications,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };

    return NextResponse.json({
      certifications: processedCertifications,
      pagination,
    });
  } catch (error) {
    console.error("[GET_CERTIFICATIONS_ERROR]", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch certifications." },
      { status: 500 }
    );
  }
}

// ========== POST HANDLER ==========

export async function POST(req: NextRequest): Promise<NextResponse> {
  return routeHandler.handle(req);
}
