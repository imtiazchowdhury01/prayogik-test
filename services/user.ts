// services/user.ts
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

// ========== TYPE DEFINITIONS ==========

interface AccessResult {
  access: boolean;
  reason:
    | "admin_override"
    | "purchased_course"
    | "enrolled_course"
    | "enrolled_certification_included_course"
    | "trial_selected_course"
    | "subscription_course"
    | "purchased_certification"
    | "enrolled_certification"
    | "no_access";
}

type CourseWithCount = {
  id: string;
  isUnderSubscription: boolean;
  _count: {
    lessons: number;
  };
};

// Use Awaited and ReturnType to extract the actual return type
type CertificationWithCourses = Awaited<
  ReturnType<typeof getCertificationById>
>;
type CertificationWithDetails = Awaited<
  ReturnType<typeof getCertificationBySlug>
>;

// ========== CACHE & REVALIDATION ==========

export const fetchUserProfile = cache(async (userId: string) => {
  const response = await fetch(Urls.user.profile(userId));
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
});

export async function revalidateCategories(): Promise<void> {
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
export async function getOrCreateUser(email: string, password: string | null = null): Promise<UserWithProfile> {
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
    // Use provided password or generate a new one
    const finalPassword = password || generateRandomPassword();
    const hashedPassword = await bcrypt.hash(finalPassword, 12);
    
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
    // Only set temporaryPassword if we generated it (not provided by user)
    temporaryPassword = password ? null : finalPassword;
    username = generatedUsername;
  }
  const processedUser = { ...user, isNewUser, temporaryPassword, username };
  return processedUser as UserWithProfile;
}

// ========== ACCESS CONTROL ==========

export const canAccessCourse = async (
  userId: string,
  courseId: string
): Promise<AccessResult> => {
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
): Promise<AccessResult> => {
  if (await hasAdminAccess()) return allow("admin_override");
  if (await hasPurchasedCertification(userId, certificationId))
    return allow("purchased_certification");
  if (await hasEnrolledCertification(userId, certificationId))
    return allow("enrolled_certification");

  return deny("no_access");
};

// ========== COURSE & CERTIFICATION QUERIES ==========

export const retrieveUserIdFromEmail = async (
  email: string
): Promise<string | null> => {
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return user?.id ?? null;
  } catch (error) {
    console.error("Error retrieving user ID:", error);
    return null;
  }
};

export const getCourseBySlug = async (
  courseSlug: string
): Promise<CourseWithCount | null> => {
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
    console.error("Error fetching course by slug:", error);
    return null;
  }
};

export const getNextCertificationCourseSlug = async (
  certificationSlug: string
): Promise<{ id: string } | null> => {
  try {
    const certification = await db.certification.findUnique({
      where: { slug: certificationSlug },
      select: {
        id: true,
      },
    });
    return certification;
  } catch (error) {
    console.error("Error fetching certification:", error);
    return null;
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
              where: { isPublished: true },
              take: 1,
              select: {
                slug: true,
              },
            },
          },
          take: 1,
        },
      },
    });
    return certification;
  } catch (error) {
    console.error("Error fetching certification by ID:", error);
    return null;
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
    console.error("Error fetching certification by slug:", error);
    return null;
  }
};

// ========== INDIVIDUAL ACCESS CHECKS ==========

const hasAdminAccess = async (): Promise<boolean> => {
  try {
    const { isAdmin } = await getServerUserSession();
    return isAdmin || false;
  } catch (error) {
    console.error("Error checking admin access:", error);
    return false;
  }
};

const hasPurchasedCourse = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    const purchase = await db.purchase.findFirst({
      where: {
        studentProfile: { userId },
        courseId,
        paymentStatus: "COMPLETED",
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
): Promise<boolean> => {
  try {
    const purchase = await db.purchase.findFirst({
      where: {
        studentProfile: { userId },
        certificationId,
        paymentStatus: "COMPLETED",
      },
    });
    return !!purchase;
  } catch (error) {
    console.error("Error checking certification purchase:", error);
    return false;
  }
};

const hasEnrolledCourse = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
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
): Promise<boolean> => {
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
): Promise<boolean> => {
  try {
    const enrolled = await db.enrolledStudents.findFirst({
      where: {
        studentProfile: { userId },
        certificationId,
      },
    });
    return !!enrolled;
  } catch (error) {
    console.error("Error checking certification enrollment:", error);
    return false;
  }
};

const hasTrialSelectedCourses = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        studentProfile: { userId },
        trialSelectedCourseIds: { has: courseId },
        subscriptionPlan: { isTrial: true },
        status: "ACTIVE",
      },
      select: {
        status: true,
        expiresAt: true,
      },
    });

    if (!subscription) return false;

    return isSubscriptionActive(subscription.status, subscription.expiresAt);
  } catch (error) {
    console.error("Error checking trial selected courses:", error);
    return false;
  }
};

const hasSubscriptionAccess = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
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
              select: { isTrial: true },
            },
          },
        },
      },
    });

    const subscription = studentProfile?.subscription;

    if (subscription?.subscriptionPlan?.isTrial) return false;

    if (!subscription?.status || !subscription?.expiresAt) return false;

    return isSubscriptionActive(subscription.status, subscription.expiresAt);
  } catch (error) {
    console.error("Error checking subscription access:", error);
    return false;
  }
};

// ========== LESSON NAVIGATION ==========

export const getNextLessonSlug = async (
  userId: string,
  courseId: string
): Promise<string | null> => {
  try {
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

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!studentProfile) return null;

    const completedLessonsCount = await db.progress.count({
      where: {
        isCompleted: true,
        lesson: {
          courseId,
          isPublished: true,
        },
        studentProfileId: studentProfile.id,
      },
    });

    if (completedLessonsCount < totalLessons) {
      const completedLessonIds = await db.progress.findMany({
        where: {
          lesson: {
            courseId,
            isPublished: true,
          },
          studentProfileId: studentProfile.id,
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

      return nextLesson?.slug ?? null;
    } else {
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

      return firstLesson?.slug ?? null;
    }
  } catch (error) {
    console.error("Error getting next lesson:", error);
    return null;
  }
};

// ========== UTILITIES ==========

const isSubscriptionActive = (
  status: string | null,
  expiresAt: Date | null
): boolean => {
  if (!status || status !== "ACTIVE") return false;
  if (!expiresAt) return false;
  return new Date() <= new Date(expiresAt);
};

const allow = (reason: AccessResult["reason"]): AccessResult => ({
  access: true,
  reason,
});

const deny = (reason: AccessResult["reason"]): AccessResult => ({
  access: false,
  reason,
});
