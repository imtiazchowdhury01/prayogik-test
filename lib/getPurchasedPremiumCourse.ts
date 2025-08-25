// @ts-nocheck
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { db } from "@/lib/db";

export const getPurchasedPremiumCourse = async (
  userId,
  currentRoute,
  take = 6
) => {
  const studentProfileId = await useStudentProfile(userId);

  const courses = await db.course.findMany({
    take: take,
    where: {
      isPublished: true,
      isUnderSubscription: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      prices: true,
      isPublished: true,
      isUnderSubscription: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      lessons: {
        select: {
          id: true,
          title: true,
          isPublished: true,
          slug: true,
          description: true,
          videoUrl: true,
          position: true,
        },
      },
      teacherProfile: {
        select: {
          id: true,
          userId: true,
          totalSales: true,
          lastPaymentDate: true,
          lastPaymentAmount: true,
          teacherStatus: true,
          subjectSpecializations: true,
          certifications: true,
          yearsOfExperience: true,
          expertiseLevel: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              bio: true,
              dateOfBirth: true,
              gender: true,
              education: true,
              nationality: true,
              phoneNumber: true,
              city: true,
              state: true,
              country: true,
              zipCode: true,
              facebook: true,
              linkedin: true,
              twitter: true,
              youtube: true,
              website: true,
              others: true,
            },
          },
        },
      },
      enrolledStudents: true,
      createdAt: true,
      updatedAt: true,
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

    purchasedCourseIds = purchasedCourses.map((purchase) => purchase.courseId);
  }

  return {
    courses,
    purchasedCourseIds,
  };
};
