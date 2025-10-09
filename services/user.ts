"use server";
import { Urls } from "@/constants/urls";
import { db } from "@/lib/db";
import { generateRandomPassword } from "@/lib/generatePassword";
import { generateUsernameFromEmail } from "@/lib/generateUserName";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";
import bcrypt from "bcrypt";
import { UserWithProfile } from "@/types/user";

export const fetchUserProfile = cache(async (userId: string) => {
  const response = await fetch(Urls.user.profile(userId));
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
});

export async function revalidateCategories() {
  revalidateTag("userProfile");
}

export const fetchUserSubscription = cache(async () => {
  const response = await fetch(Urls.user.subscription, {
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
  });
  if (!response.ok) throw new Error("Failed to fetch user subscriptions");
  return response.json();
});

/**
 * ============ get or create user by email address ==========
 */
export async function getOrCreateUser(email: string): Promise<UserWithProfile> {
  let isNewUser: boolean = false;
  let temporaryPassword: string | null = null;
  let username: string | null = null;
  let user = await db.user.findUnique({
    where: { email },
    include: {
      studentProfile: {
        include: {
          subscription: {
            include: { subscriptionPlan: true },
          },
        },
      },
      eventRegistrations: true,
    },
  });

  if (!user) {
    const generatedUsername = generateUsernameFromEmail(email);
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 12);

    user = await db.user.create({
      data: {
        name: generatedUsername,
        email,
        password: hashedPassword,
        username: generatedUsername,
        emailVerified: true,
        accountStatus: "ACTIVE",
        studentProfile: {
          create: {},
        },
      },
      include: {
        studentProfile: {
          include: {
            subscription: {
              include: { subscriptionPlan: true },
            },
          },
        },
        eventRegistrations: true,
      },
    });
    isNewUser = true;
    temporaryPassword = password;
    username = generatedUsername;
  }
  const processedUser = { ...user, isNewUser, temporaryPassword, username };

  return processedUser as UserWithProfile;
}

/**
 * ========== ACCESS CONTROL ==========
 */
export const canAccessCourse = async (userId: string, courseId: string) => {
  // Priority order: user -> admin > purchase > enrolled > subscription
  if (await hasAdminAccess()) return allow("admin_override");
  if (await hasPurchasedCourse(userId, courseId))
    return allow("purchased_course");
  if (await hasEnrolledCourse(userId, courseId))
    return allow("enrolled_course");
  if (await hasCourseEnrolledWithCertification(userId, courseId))
    return allow("enrolled_certification_included_course");
  if (await hasTrialSelectedCourses(userId, courseId))
    return allow("trial_selected_course");
  if (await hasSubscriptionAccess(userId, courseId))
    return allow("subscription_course");

  return deny("no_access");
};

export const canAccessCertification = async (
  userId: string,
  certificationId: string
) => {
  // Priority order: user -> admin > purchase > enrolled > subscription
  if (await hasAdminAccess()) return allow("admin_override");
  if (await hasPurchasedCertification(userId, certificationId))
    return allow("purchased_certification");
  if (await hasEnrolledCertification(userId, certificationId))
    return allow("enrolled_certification");

  return deny("no_access");
};

/**
 * ========== INDIVIDUAL CHECKS ==========
 */

export const retrieveUserIdFromEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) return null;
    return user.id;
  } catch (error) {
    console.error(error);
  }
};

export const getCourseBySlug = async (courseSlug: string) => {
  try {
    const course = await db.course.findUnique({
      where: { slug: courseSlug },
      select: {
        id: true,
        isUnderSubscription: true,
        _count: {
          select: {
            lessons: {
              where: { isPublished: true },
            },
          },
        },
      },
    });
    return course;
  } catch (error) {
    console.error(error);
  }
};

export const getNextCertificationCourseSlug = async (
  certificationSlug: string
) => {
  try {
    const certification = await db.certification.findUnique({
      where: { slug: certificationSlug },
      select: {
        id: true,
      },
    });
    return certification;
  } catch (error) {
    console.error(error);
  }
};

export const getCertificationById = async (certificationId: string) => {
  try {
    const certification = await db.certification.findUnique({
      where: { id: certificationId },
      include: {
        prices: true,
        courses: {
          select: {
            slug: true,
            lessons: {
              take: 1,
            },
          },
          take: 1,
        },
      },
    });
    return certification;
  } catch (error) {
    console.error(error);
  }
};

export const getCertificationBySlug = async (certificationSlug: string) => {
  try {
    const certification = await db.certification.findUnique({
      where: { slug: certificationSlug },
      include: {
        prices: true,
        teacherProfile: {
          select: {
            user: true,
          },
        },
        enrolledStudents: true,
      },
    });
    return certification;
  } catch (error) {
    console.error(error);
  }
};

const hasAdminAccess = async () => {
  try {
    const { isAdmin } = await getServerUserSession();
    return isAdmin || false;
  } catch (error) {
    console.error("Error checking admin access:", error);
    return false;
  }
};

const hasPurchasedCourse = async (userId: string, courseId: string) => {
  try {
    const purchase = await db.purchase.findFirst({
      where: {
        studentProfile: { userId },
        courseId,
      },
    });
    return !!purchase;
  } catch (error) {
    console.error("Error checking course purchase:", error);
    return false;
  }
};

const hasPurchasedCertification = async (
  userId: string,
  certificationId: string
) => {
  try {
    const purchase = await db.purchase.findFirst({
      where: {
        studentProfile: { userId },
        certificationId,
      },
    });
    return !!purchase;
  } catch (error) {
    console.error("Error checking certification purchase:", error);
    return false;
  }
};

const hasEnrolledCourse = async (userId: string, courseId: string) => {
  try {
    const enrolled = await db.enrolledStudents.findFirst({
      where: {
        studentProfile: { userId },
        courseId,
      },
    });
    return !!enrolled;
  } catch (error) {
    console.error("Error checking course enrollment:", error);
    return false;
  }
};

const hasCourseEnrolledWithCertification = async (
  userId: string,
  courseId: string
) => {
  try {
    const enrolled = await db.enrolledStudents.findFirst({
      where: {
        studentProfile: { userId },
        certification: {
          courseIds: {
            has: courseId,
          },
        },
      },
    });
    return !!enrolled;
  } catch (error) {
    console.error(
      "Error checking course under certification enrollment:",
      error
    );
    return false;
  }
};

const hasEnrolledCertification = async (
  userId: string,
  certificationId: string
) => {
  try {
    const enrolled = await db.enrolledStudents.findFirst({
      where: {
        studentProfile: { userId },
        certificationId,
      },
    });
    return !!enrolled;
  } catch (error) {
    console.error("Error checking course enrollment:", error);
    return false;
  }
};

const hasTrialSelectedCourses = async (userId: string, courseId: string) => {
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        studentProfile: {
          userId,
        },
        trialSelectedCourseIds: {
          has: courseId,
        },
        subscriptionPlan: {
          isTrial: true,
        },
      },
    });

    return isSubscriptionActive(subscription?.status!, subscription?.expiresAt);
  } catch (error) {
    console.error("Error checking trial selected courses:", error);
    return false;
  }
};

const hasSubscriptionAccess = async (userId: string, courseId: string) => {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { isUnderSubscription: true },
    });

    if (!course?.isUnderSubscription) return false;

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      include: {
        subscription: {
          select: {
            status: true,
            expiresAt: true,
            subscriptionPlan: {
              select: {
                isTrial: true,
              },
            },
          },
        },
      },
    });

    const subscription = studentProfile?.subscription;
    if (subscription?.subscriptionPlan?.isTrial) return false;

    return isSubscriptionActive(subscription?.status!, subscription?.expiresAt);
  } catch (error) {
    console.error("Error checking subscription access:", error);
    return false;
  }
};

export const getNextLessonSlug = async (userId: string, courseId: string) => {
  try {
    // Get total lessons count
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        _count: {
          select: {
            lessons: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    if (!course || course._count.lessons === 0) {
      return null;
    }

    const totalLessons = course._count.lessons;

    // Count completed lessons
    const completedLessonsCount = await db.progress.count({
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

    if (completedLessonsCount < totalLessons) {
      // Find next incomplete lesson
      const completedLessonIds = await db.progress.findMany({
        where: {
          lesson: {
            courseId,
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

      const completedIds = completedLessonIds.map((item) => item.lessonId);

      const nextLesson = await db.lesson.findFirst({
        where: {
          courseId,
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

      return nextLesson?.slug || null;
    } else {
      // All lessons completed, return first lesson
      const firstLesson = await db.lesson.findFirst({
        where: {
          courseId,
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
        select: {
          slug: true,
        },
      });

      return firstLesson?.slug || null;
    }
  } catch (error) {
    console.error("Error getting next lesson:", error);
    return null;
  }
};

/**
 * ========== UTILITIES ==========
 */

const isSubscriptionActive = (status?: string, expiresAt?: Date | null) => {
  if (status !== "ACTIVE") return false;
  if (!expiresAt) return false;
  return new Date() <= expiresAt;
};

const allow = (reason: string) => ({ access: true, reason });
const deny = (reason: string) => ({ access: false, reason });
