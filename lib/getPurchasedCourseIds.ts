// @ts-nocheck
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";

export const getCoursesAndPurchasedCourseIds = async (userId, currentRoute) => {
  try {
    const studentProfileId = await useStudentProfile(userId);

    // Determine the courses to retrieve based on the current route
    const takeCourses = currentRoute === "home" ? 16 : undefined; // Take 8 courses for home route, otherwise take all
    const courses = await db.course.findMany({
      take: takeCourses,
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        prices: true,
        isPublished: true,
        isUnderSubscription: true,
        lessons: {
          where: {
            isPublished: true,
          },
          select: {
            title: true,
            isPublished: true,
            isFree: true,
            slug: true,
            videoUrl: true,
          },
          take: 1,
        },
        teacherProfile: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrolledStudents: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    let purchasedCourseIds = [];
    if (studentProfileId) {
      const purchasedCourses = await db.purchase.findMany({
        where: {
          studentProfileId: studentProfileId,
        },
        select: {
          courseId: true,
        },
      });

      purchasedCourseIds = purchasedCourses.map(
        (purchase) => purchase.courseId
      );
    }

    return {
      courses,
      purchasedCourseIds,
    };
  } catch (err) {
    console.log("[getCourseAndPurchaseId Error]:", err);
    return { courses: [], purchasedCourseIds: [] };
  }
};
