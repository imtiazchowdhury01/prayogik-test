import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";

import { isTeacher } from "@/lib/teacher";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { getUserSubscription } from "@/lib/getUserSubscription";
import { RouteHandler } from "@/lib/utils/server/route-handler";
import { z } from "zod";
import { Role } from "@prisma/client";

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
        userId: userId, // Getting the teacher profile using userId
      },
    });

    const course = await db.course.create({
      data: {
        teacherProfileId: teacherProfile?.id!,
        title,
        slug,
      },
    });

    return course;
  },
  "POST",
  [Role.TEACHER, Role.ADMIN]
);

// Course filter utility function
const courseFilters = ({
  title,
  category,
  teacherSlug,
  categoryId,
}: {
  title?: string;
  category?: string;
  teacherSlug?: string;
  categoryId?: string;
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

  return filters;
};

export async function GET(req: Request) {
  const { userId, role } = await getServerUserSession();

  try {
    const url = new URL(req.url);
    let page = parseInt(url.searchParams.get("page") || "1", 10);
    page = isNaN(page) || page < 1 ? 1 : page;
    const limit =
      parseInt(url.searchParams.get("limit") || "10") > 50
        ? 10
        : parseInt(url.searchParams.get("limit") || "10");
    const title = url.searchParams.get("title") || undefined;
    const category = url.searchParams.get("category") || undefined;
    const teacherSlug = url.searchParams.get("teacher") || undefined;
    const sort = url.searchParams.get("sort") === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;

    // Apply the filters without restricting to purchased courses
    const filters = courseFilters({ title, category, teacherSlug });

    // Get purchased course IDs for logged-in user (for additional data like progress)
    let purchasedCourseIds: string[] = [];

    if (userId) {
      const studentProfileId = await useStudentProfile(userId);
      const purchases = await db.enrolledStudents.findMany({
        where: {
          studentProfileId,
          course: {
            isPublished: true,
          },
        },
        select: {
          courseId: true,
        },
      });
      purchasedCourseIds = purchases.map((p) => p.courseId);
      // Check if the user is subscribed
      const userSubscription = await getUserSubscription();
      // console.log(userSubscription, "FROM COURSES API");

      if (userSubscription?.status === "ACTIVE") {
        const isUnderSubscriptionsCourses = await db.course.findMany({
          where: {
            isUnderSubscription: true,
          },
        });

        const isUnderSubscriptionsCoursesIDs = isUnderSubscriptionsCourses.map(
          (course) => course.id
        );
        purchasedCourseIds = [
          ...purchasedCourseIds,
          ...isUnderSubscriptionsCoursesIDs,
        ];
      }
    }

    // Use only the filters - don't restrict to purchased courses
    const whereClause = filters;

    // Fetch paginated courses
    const courses = await db.course.findMany({
      where: whereClause,
      orderBy: { updatedAt: sort },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        totalDuration: true,
        isUnderSubscription: true,
        courseMode: true,
        courseType: true,
        courseLiveLinkScheduledAt: true,
        courseLiveLink: true,
        lessons: {
          where: {
            isFree: true,
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            position: true,
            videoUrl: true,
            videoStatus: true,
            isFree: true,
            isPublished: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            lessons: {
              where: { isPublished: true },
            },
            enrolledStudents: true,
          },
        },
        teacherProfile: {
          select: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        imageUrl: true,
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

    const processedCourses = await Promise.all(
      courses.map(async (course) => {
        let progress = null;
        let nextLessonSlug = null;
        const isPurchased = purchasedCourseIds.includes(course.id);

        // Only calculate progress and next lesson for purchased courses
        if (userId && isPurchased) {
          const totalLessons = course._count.lessons;

          const completedLessonsCount = await db.progress.count({
            where: {
              isCompleted: true,
              lesson: {
                courseId: course.id,
                isPublished: true,
              },
              studentProfile: {
                userId,
              },
            },
          });

          if (totalLessons > 0) {
            progress = Math.ceil((completedLessonsCount / totalLessons) * 100);
          }

          if (completedLessonsCount < totalLessons) {
            const completedLessonIds = await db.progress.findMany({
              where: {
                lesson: {
                  courseId: course.id,
                  isPublished: true,
                },
                studentProfile: {
                  userId,
                },
                isCompleted: true,
              },
              select: {
                lessonId: true,
              },
            });

            const completedIds = completedLessonIds.map(
              (item) => item.lessonId
            );

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

            if (nextLesson) {
              nextLessonSlug = nextLesson.slug;
            }
          } else if (totalLessons > 0) {
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

            if (firstLesson) {
              nextLessonSlug = firstLesson.slug;
            }
          }
        }

        return {
          ...course,
          progress,
          nextLessonSlug,
          isPurchased, // Add this field to easily identify purchased courses on frontend
        };
      })
    );

    const totalCourses = await db.course.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCourses / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      courses: processedCourses,
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

export async function POST(req: NextRequest) {
  return routeHandler.handle(req);
}
