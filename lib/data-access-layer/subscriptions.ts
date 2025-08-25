"use server";

import { db } from "../db";
import { getServerUserSession } from "../getServerUserSession";

async function getSubscriptionDBCall() {
  try {
    // Fetching subscription plans along with subscription discounts
    const subscriptions = await db.subscriptionPlan.findMany({
      include: {
        subscriptionDiscount: true,
        _count: {
          select: {
            subscription: true,
          },
        },
      },
    });

    return subscriptions;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
}
async function getSubscriptionPlanByIdDBCall(planId: string) {
  try {
    const subscription = await db.subscriptionPlan.findUnique({
      where: { id: planId },
      include: {
        subscriptionDiscount: true,
        _count: {
          select: {
            subscription: true,
          },
        },
      },
    });

    return subscription; // will be null if not found
  } catch (error) {
    console.error("Error fetching subscription by ID:", error);
    return null;
  }
}

async function getSubscriptionCoursesDBCall(limit: number) {
  try {
    // Fetching subscription plans along with subscription discounts
    const subscriptionsCourses = await db.course.findMany({
      take: limit, // Fetch 10 courses by default, or all if `take=all`
      orderBy: {
        createdAt: "desc",
      },

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
            isFree: true,
            slug: true,
            description: true,
            videoUrl: true,
            position: true,
            videoStatus: true,
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
    return subscriptionsCourses;
  } catch (error) {
    console.error("Error fetching subscriptionsCourses:", error);
    return [];
  }
}
async function checkUserTrialHistoryDBCall() {
  const { userId } = await getServerUserSession();

  if (!userId) {
    return null;
  }
  try {
    // Get studentProfile first
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) return false;

    const trialPurchase = await db.purchase.findFirst({
      where: {
        studentProfileId: studentProfile.id,
        purchaseType: "TRIAL",
      },
    });

    return !!trialPurchase; // Returns true if user has used trial before
  } catch (error) {
    console.error("Error checking trial history:", error);
    return false;
  }
}
// previous version
async function checkUserTrialHistory(userId: string) {
  try {
    // Get studentProfile first
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) return false;

    const trialPurchase = await db.purchase.findFirst({
      where: {
        studentProfileId: studentProfile.id,
        purchaseType: "TRIAL",
      },
    });

    return !!trialPurchase; // Returns true if user has used trial before
  } catch (error) {
    console.error("Error checking trial history:", error);
    return false;
  }
}
export {
  getSubscriptionDBCall,
  getSubscriptionCoursesDBCall,
  getSubscriptionPlanByIdDBCall,
  checkUserTrialHistory, // previous version
  checkUserTrialHistoryDBCall,
};
