// @ts-nocheck
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerUserSession } from "@/lib/getServerUserSession";
import {
  addMonths,
  addYears,
} from "@/lib/utils/expireDate/generate-expire-date";

// Update a specific teacher's details
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { isAdmin } = await getServerUserSession(request);

  const { userId } = params;

  // Get the updated data from the request body
  const { subscriptionListIds, ...updatedData } = await request.json();
  try {
    if (!isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    // Fetch the existing teacher data
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: true,
        studentProfile: {
          include: {
            enrolledCourseIds: true,
          },
        },
      },
    });

    // If the teacher doesn't exist, return a not found error
    if (!existingUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Create a new data object with only the fields that need to be updated
    const dataToUpdateOnUserModel: any = {};
    const dataToUpdateOnTeacherProfileModel: any = {};
    const dataToUpdateOnStudentProfileModel: any = {};

    // Define TeacherProfile fields based on your schema
    const teacherProfileFields = [
      "totalSales",
      "lastPaymentDate",
      "lastPaymentAmount",
      "teacherStatus",
      "subjectSpecializations",
      "certifications",
      "yearsOfExperience",
      "expertiseLevel",
      "teacherRankId",
      "coTeachingCourseIds",
    ];

    // Dynamically add fields from updatedData if they exist
    for (const key of Object.keys(updatedData)) {
      if (key in existingUser) {
        dataToUpdateOnUserModel[key] = updatedData[key];
      }
      // Check if key is for TeacherProfile
      if (existingUser.teacherProfile && key in existingUser.teacherProfile) {
        dataToUpdateOnTeacherProfileModel[key] = updatedData[key];
      }

      // Check if key is for TeacherProfile - use the defined fields array instead of checking null object
      if (teacherProfileFields.includes(key)) {
        dataToUpdateOnTeacherProfileModel[key] = updatedData[key];
      }

      if (existingUser.studentProfile && key in existingUser.studentProfile) {
        dataToUpdateOnStudentProfileModel[key] = updatedData[key];
      }
    }

    if (Object.keys(dataToUpdateOnUserModel).length > 0) {
      await db.user.update({
        where: { id: userId },
        data: dataToUpdateOnUserModel,
      });
    }

    if (Object.keys(dataToUpdateOnTeacherProfileModel).length > 0) {
      if (existingUser.teacherProfile) {
        await db.teacherProfile.update({
          where: { id: existingUser.teacherProfile?.id },
          data: dataToUpdateOnTeacherProfileModel,
        });
      } else {
        // Fetch all ranks
        const unsortedRanks = await db.teacherRank.findMany();
        const ranks = unsortedRanks.sort(
          (a, b) => a.numberOfSales - b.numberOfSales
        );

        await db.teacherProfile.create({
          data: {
            ...dataToUpdateOnTeacherProfileModel,
            userId: existingUser.id,
            teacherRankId: ranks[0]?.id,
          },
        });
      }
    }

    const existingEnrollments = await db.enrolledStudents.findMany({
      where: { studentProfileId: existingUser.studentProfile?.id },
      select: { courseId: true },
    });

    const existingCourseIds: any = new Set(
      existingEnrollments.map((e) => e.courseId)
    );

    const updatedCourseIds: any = new Set(
      dataToUpdateOnStudentProfileModel.enrolledCourseIds || []
    );

    // **Find New Courses to Add**
    const newCourseIds = [...updatedCourseIds].filter(
      (courseId) => !existingCourseIds.has(courseId)
    );

    // **Find Removed Courses to Delete**
    const removedCourseIds = [...existingCourseIds].filter(
      (courseId) => !updatedCourseIds.has(courseId)
    );

    // **Insert New Courses**
    if (newCourseIds.length > 0) {
      await db.enrolledStudents.createMany({
        data: newCourseIds.map((courseId) => ({
          studentProfileId: existingUser.studentProfile?.id,
          courseId: courseId,
        })),
      });
    }

    // ======== SUBSCRIPTION HANDLING START ========

    if (existingUser.studentProfile?.id) {
      // Check for existing subscription (any plan)
      const existingSubscription = await db.subscription.findFirst({
        where: { studentProfileId: existingUser.studentProfile.id },
      });

      // Case 1: Empty array - handle subscription removal
      if (subscriptionListIds.length === 0) {
        // console.log("FROM IF - Empty subscription list");

        // Only deactivate if there's an existing active subscription
        if (existingSubscription) {
          await db.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              status: "INACTIVE",
            },
          });
        }
      }
      // Case 2: Has subscription IDs
      else {
        // console.log("FROM ELSE - Has subscription IDs");
        const subscriptionPlanId = subscriptionListIds[0];

        const subscriptionPlan = await db.subscriptionPlan.findUnique({
          where: { id: subscriptionPlanId },
        });

        if (!subscriptionPlan) {
          return NextResponse.json(
            { message: "Subscription plan not found." },
            { status: 404 }
          );
        }

        // Calculate expiration
        const now = new Date();
        let expiresAt = new Date(now);
        let trialEndsAt = null;
        let trialStartedAt = null;

        // UPGRADE LOGIC: Add remaining time from current subscription
        if (
          existingSubscription &&
          existingSubscription.status === "ACTIVE" &&
          new Date(existingSubscription.expiresAt) > now
        ) {
          // Calculate remaining time from current subscription
          const remainingTime =
            new Date(existingSubscription.expiresAt).getTime() - now.getTime();
          const remainingDays = Math.ceil(
            remainingTime / (1000 * 60 * 60 * 24)
          );

          // Start from current expiry date instead of now
          expiresAt = new Date(existingSubscription.expiresAt);

          console.log(
            `Upgrade detected: Adding ${remainingDays} days from current subscription`
          );
        }

        // Add new subscription duration
        if (subscriptionPlan.type === "MONTHLY") {
          expiresAt.setMonth(
            expiresAt.getMonth() + (subscriptionPlan.durationInMonths || 1)
          );
        } else if (subscriptionPlan.type === "YEARLY") {
          expiresAt.setFullYear(
            expiresAt.getFullYear() + (subscriptionPlan.durationInYears || 1)
          );
          console.log("FROM ELSE IF:", subscriptionPlan.type, expiresAt);
        } else {
          trialStartedAt = new Date();
          trialEndsAt = new Date();
          trialEndsAt.setDate(
            trialEndsAt.getDate() + (subscriptionPlan.trialDurationInDays || 30)
          );
        }

        // Update existing or create new
        if (existingSubscription) {
          await db.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              subscriptionPlanId,
              status: "ACTIVE",
              expiresAt,
              isTrial: existingSubscription.isTrial
                ? true
                : subscriptionPlan?.isTrial,
              trialStartedAt,
              trialEndsAt,
            },
          });
        } else {
          await db.subscription.create({
            data: {
              studentProfileId: existingUser.studentProfile.id,
              subscriptionPlanId,
              expiresAt,
              status: "ACTIVE",
              isTrial: subscriptionPlan?.isTrial,
              trialStartedAt,
              trialEndsAt,
            },
          });
        }
      }
    }

    // ======== SUBSCRIPTION HANDLING END ========

    // **Delete Removed Courses**
    if (removedCourseIds.length > 0) {
      await db.enrolledStudents.deleteMany({
        where: {
          studentProfileId: existingUser.studentProfile?.id,
          courseId: { in: removedCourseIds },
        },
      });
    }

    const updatedTeacher = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    return NextResponse.json(updatedTeacher, { status: 200 });
  } catch (error) {
    console.log("ERROR_FROM_UPDATE_TEACHER_API", error);
    // Return an error response
    return NextResponse.json(
      { message: "Failed to update teacher.", error: error.message },
      { status: 400 }
    );
  }
}

// get single teacher details
export async function GET(request, { params }) {
  const { userId } = params;

  try {
    const userData = await db.user.findFirst({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            enrolledCourseIds: true,
          },
        },
        teacherProfile: {
          include: {
            teacherRank: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // get the user's subscription information
    let userSubscription = await db.subscription.findUnique({
      where: {
        studentProfileId: userData.studentProfile?.id,
        status: "ACTIVE",
      },
      select: {
        id: true,
        subscriptionPlan: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (userSubscription) {
      return NextResponse.json({
        ...userData,
        subscriptionList: [userSubscription.subscriptionPlan?.id],
      });
    }
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { message: "Failed to get teacher.", error: error },
      { status: 400 }
    );
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  // console.log("DELETE API HITTED");
  const { userId } = params;

  try {
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // First, get basic user info to check profiles
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: { select: { id: true } },
        studentProfile: { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Delete student profile and related data if exists
    if (user.studentProfile) {
      await deleteStudentProfile(user.studentProfile.id);
    }

    // Delete teacher profile and related data if exists
    if (user.teacherProfile) {
      await deleteTeacherProfile(user.teacherProfile.id);
    }

    // Finally delete the user
    const deletedUser = await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User and all associated data deleted successfully",
        deletedUser: {
          id: deletedUser.id,
          name: deletedUser.name,
          email: deletedUser.email,
          role: deletedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting user:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        error:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Helper function to delete student profile and all related data
async function deleteStudentProfile(studentProfileId: string) {
  // Delete nested comment replies first
  await db.$transaction(async (tx) => {
    const comments = await tx.comment.findMany({
      where: { studentProfileId },
      select: { id: true },
    });

    if (comments.length > 0) {
      await tx.comment.deleteMany({
        where: { parentId: { in: comments.map((c) => c.id) } },
      });
    }
  });

  // Delete student's comments
  await db.comment.deleteMany({
    where: { studentProfileId },
  });

  // Delete student's ratings and reviews
  await db.$transaction([
    db.rating.deleteMany({
      where: { studentProfileId },
    }),
    db.review.deleteMany({
      where: { studentProfileId },
    }),
  ]);

  // Delete progress records
  await db.progress.deleteMany({
    where: { studentProfileId },
  });

  // Delete enrolled students records
  await db.enrolledStudents.deleteMany({
    where: { studentProfileId },
  });

  // Delete subscription if exists
  await db.subscription.deleteMany({
    where: { studentProfileId },
  });

  // Delete purchase history
  await db.purchaseHistory.deleteMany({
    where: { studentProfileId },
  });

  // Handle purchases and related data
  const purchases = await db.purchase.findMany({
    where: { studentProfileId },
    select: { id: true },
  });

  if (purchases.length > 0) {
    const purchaseIds = purchases.map((p) => p.id);

    await db.$transaction([
      db.aamarPayData.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.teacherRevenue.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.purchase.deleteMany({
        where: { id: { in: purchaseIds } },
      }),
    ]);
  }

  // Finally delete the student profile
  await db.studentProfile.delete({
    where: { id: studentProfileId },
  });
}

// Helper function to delete teacher profile and all related data
async function deleteTeacherProfile(teacherProfileId: string) {
  // Delete teacher financial records
  await db.$transaction([
    db.teacherBalance.deleteMany({
      where: { teacherProfileId },
    }),
    db.teacherPayments.deleteMany({
      where: { teacherProfileId },
    }),
    db.teacherMonthlyEarnings.deleteMany({
      where: { teacherProfileId },
    }),
    db.teacherRevenue.deleteMany({
      where: { teacherProfileId },
    }),
  ]);

  // Delete payment methods
  await db.paymentMethod.deleteMany({
    where: { teacherProfileId },
  });

  // Delete teacher's purchases
  await db.purchase.deleteMany({
    where: { teacherProfileId },
  });

  // Get all courses created by this teacher
  const courses = await db.course.findMany({
    where: { teacherProfileId },
    select: { id: true },
  });

  if (courses.length > 0) {
    const courseIds = courses.map((c) => c.id);

    // Delete all course-related data in batches
    await deleteCoursesAndRelatedData(courseIds);
  }

  // Remove teacher from co-teaching relationships
  await db.course.updateMany({
    where: { coTeacherIds: { has: teacherProfileId } },
    data: { coTeacherIds: { set: [] } },
  });

  // Finally delete the teacher profile
  await db.teacherProfile.delete({
    where: { id: teacherProfileId },
  });
}

// Helper function to delete courses and all their related data
async function deleteCoursesAndRelatedData(courseIds: string[]) {
  // First get all lessons for these courses
  const lessons = await db.lesson.findMany({
    where: { courseId: { in: courseIds } },
    select: { id: true },
  });
  const lessonIds = lessons.map((l) => l.id);

  // Delete all related data in parallel where possible
  await db.$transaction([
    db.enrolledStudents.deleteMany({
      where: { courseId: { in: courseIds } },
    }),
    db.comment.deleteMany({
      where: { courseId: { in: courseIds } },
    }),
    db.rating.deleteMany({
      where: { courseId: { in: courseIds } },
    }),
    db.review.deleteMany({
      where: { courseId: { in: courseIds } },
    }),
    db.progress.deleteMany({
      where: { lessonId: { in: lessonIds } },
    }),
    db.lesson.deleteMany({
      where: { id: { in: lessonIds } },
    }),
    db.attachment.deleteMany({
      where: { courseId: { in: courseIds } },
    }),
  ]);

  // Handle purchases for these courses
  const purchases = await db.purchase.findMany({
    where: { courseId: { in: courseIds } },
    select: { id: true },
  });

  if (purchases.length > 0) {
    const purchaseIds = purchases.map((p) => p.id);

    await db.$transaction([
      db.aamarPayData.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.teacherRevenue.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.purchase.deleteMany({
        where: { id: { in: purchaseIds } },
      }),
    ]);
  }

  // Delete prices
  await db.price.deleteMany({
    where: { courseId: { in: courseIds } },
  });

  // Remove courses from bundles and membership plans
  await db.$transaction([
    db.bundle.updateMany({
      where: { courseIds: { hasSome: courseIds } },
      data: { courseIds: { set: [] } },
    }),
    db.membershipPlan.updateMany({
      where: { courseIds: { hasSome: courseIds } },
      data: { courseIds: { set: [] } },
    }),
  ]);

  // Finally delete the courses
  await db.course.deleteMany({
    where: { id: { in: courseIds } },
  });
}
