// @ts-nocheck
"use server";

import { db } from "./db";

export async function checkUserAccessToContent(
  email: string,
  contentId: string,
  contentType = "course"
) {
  try {
    // Find student profile by email
    const studentProfile = await db.studentProfile.findFirst({
      where: {
        user: {
          email: email,
        },
      },
      include: {
        purchases: {
          where: {
            OR: [
              // Direct course purchase
              contentType === "course" ? { courseId: contentId } : {},
              // Certification purchase
              contentType === "certification"
                ? { certificationId: contentId }
                : {},
              // Subscription that might include the content
              { purchaseType: "SUBSCRIPTION" },
            ],
          },
          include: {
            subscription: {
              include: {
                subscription: {
                  include: {
                    subscriptionPlan: true,
                  },
                },
              },
            },
          },
        },
        enrolledCourseIds:
          contentType === "course"
            ? {
                where: {
                  courseId: contentId,
                },
              }
            : contentType === "certification"
            ? {
                where: {
                  certificationId: contentId,
                },
              }
            : {},
        subscription: {
          include: {
            subscriptionPlan: true,
            trialSelectedCourses:
              contentType === "course"
                ? {
                    where: {
                      id: contentId,
                    },
                  }
                : {},
          },
        },
      },
    });

    if (!studentProfile) {
      return {
        hasAccess: false,
        accessType: "none",
        purchaseInfo: null,
      };
    }

    // Check direct purchases
    const directPurchase = studentProfile.purchases.find((purchase) => {
      if (contentType === "course") {
        return purchase.courseId === contentId;
      }
      if (contentType === "certification") {
        return purchase.certificationId === contentId;
      }
      return false;
    });

    if (directPurchase) {
      return {
        hasAccess: true,
        accessType: "direct_purchase",
        purchaseInfo: directPurchase,
        message: "আপনি ইতিমধ্যে এই কোর্সটি কিনেছেন",
      };
    }

    // Check enrollment (for free courses or admin enrollment)
    if (studentProfile.enrolledCourseIds.length > 0) {
      return {
        hasAccess: true,
        accessType: "enrolled",
        purchaseInfo: null,
        message: "আপনি ইতিমধ্যে এই কোর্সে এনরোল করেছেন",
      };
    }

    // Check subscription access
    const subscription = studentProfile.subscription;
    if (subscription && subscription.status === "ACTIVE") {
      // Check if course is under subscription
      if (contentType === "course") {
        const course = await db.course.findUnique({
          where: { id: contentId },
          select: { isUnderSubscription: true },
        });

        if (course?.isUnderSubscription) {
          return {
            hasAccess: true,
            accessType: "subscription",
            purchaseInfo: subscription,
            message: "এই কোর্সটি আপনার সাবস্ক্রিপশনে অন্তর্ভুক্ত",
          };
        }
      }

      // Check trial access
      if (
        subscription.isTrial &&
        subscription.trialSelectedCourses.length > 0
      ) {
        return {
          hasAccess: true,
          accessType: "trial",
          purchaseInfo: subscription,
          message: "এই কোর্সটি আপনার ট্রায়াল সাবস্ক্রিপশনে অন্তর্ভুক্ত",
        };
      }
    }

    return {
      hasAccess: false,
      accessType: "none",
      purchaseInfo: null,
    };
  } catch (error) {
    console.error("Error checking user access:", error);
    return {
      hasAccess: false,
      accessType: "error",
      purchaseInfo: null,
      error: error.message,
    };
  }
}
