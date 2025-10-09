// api/admin/users/[userId]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { Role, UserAccountStatus, UserPlanType } from "@prisma/client";

interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  role?: Role;
  accountStatus?: UserAccountStatus;
  currentPlan?: UserPlanType;
  bio?: string;
  dateOfBirth?: Date;
  gender?: string;
  education?: string[];
  nationality?: string;
  phoneNumber?: string;
  profession?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
  others?: string;
  [key: string]: any;
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { isAdmin } = await getServerUserSession(request);

  const { userId } = params;

  const body = await request.json();
  const { subscriptionListIds, ...updatedData } = body as {
    subscriptionListIds?: string[];
    [key: string]: any;
  };

  try {
    if (!isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

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

    if (!existingUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const dataToUpdateOnUserModel: Partial<UpdateUserData> = {};
    const dataToUpdateOnTeacherProfileModel: Record<string, any> = {};
    const dataToUpdateOnStudentProfileModel: Record<string, any> = {};

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
      "coTeachingCertificationIds",
    ];

    const userFields = [
      "name",
      "username",
      "email",
      "avatarUrl",
      "emailVerified",
      "role",
      "accountStatus",
      "currentPlan",
      "bio",
      "dateOfBirth",
      "gender",
      "education",
      "nationality",
      "phoneNumber",
      "profession",
      "city",
      "state",
      "country",
      "zipCode",
      "facebook",
      "linkedin",
      "twitter",
      "youtube",
      "website",
      "others",
    ];

    for (const key of Object.keys(updatedData)) {
      if (userFields.includes(key)) {
        dataToUpdateOnUserModel[key] = updatedData[key];
      }

      if (teacherProfileFields.includes(key)) {
        dataToUpdateOnTeacherProfileModel[key] = updatedData[key];
      }

      if (key === "enrolledCourseIds") {
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
          where: { id: existingUser.teacherProfile.id },
          data: dataToUpdateOnTeacherProfileModel,
        });
      } else {
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

    if (
      existingUser.studentProfile?.id &&
      dataToUpdateOnStudentProfileModel.enrolledCourseIds
    ) {
      const existingEnrollments = await db.enrolledStudents.findMany({
        where: { studentProfileId: existingUser.studentProfile.id },
        select: { courseId: true },
      });

      const existingCourseIds = existingEnrollments
        .map((e) => e.courseId)
        .filter((id): id is string => id !== null);

      const updatedCourseIds =
        (dataToUpdateOnStudentProfileModel.enrolledCourseIds as string[]) || [];

      const newCourseIds = updatedCourseIds.filter(
        (courseId) => !existingCourseIds.includes(courseId)
      );

      const removedCourseIds = existingCourseIds.filter(
        (courseId) => !updatedCourseIds.includes(courseId)
      );

      if (newCourseIds.length > 0) {
        await db.enrolledStudents.createMany({
          data: newCourseIds.map((courseId) => ({
            studentProfileId: existingUser.studentProfile!.id,
            courseId: courseId,
          })),
        });
      }

      if (removedCourseIds.length > 0) {
        await db.enrolledStudents.deleteMany({
          where: {
            studentProfileId: existingUser.studentProfile.id,
            courseId: { in: removedCourseIds },
          },
        });
      }
    }

    if (existingUser.studentProfile?.id && subscriptionListIds !== undefined) {
      const existingSubscription = await db.subscription.findFirst({
        where: { studentProfileId: existingUser.studentProfile.id },
      });

      if (subscriptionListIds.length === 0) {
        if (existingSubscription) {
          await db.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              status: "INACTIVE",
            },
          });
        }
      } else {
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

        const now = new Date();
        let expiresAt = new Date(now);
        let trialEndsAt: Date | null = null;
        let trialStartedAt: Date | null = null;

        if (existingSubscription && existingSubscription.status === "ACTIVE") {
          const currentExpiryDate = new Date(existingSubscription.expiresAt);

          if (currentExpiryDate > now && !subscriptionPlan.isTrial) {
            expiresAt = new Date(currentExpiryDate);
          }
        }

        if (subscriptionPlan.type === "MONTHLY") {
          expiresAt.setMonth(
            expiresAt.getMonth() + (subscriptionPlan.durationInMonths || 1)
          );
        } else if (subscriptionPlan.type === "YEARLY") {
          expiresAt.setFullYear(
            expiresAt.getFullYear() + (subscriptionPlan.durationInYears || 1)
          );
        } else if (subscriptionPlan.isTrial) {
          trialStartedAt = new Date();
          trialEndsAt = new Date();
          expiresAt = new Date();

          const trialDuration = subscriptionPlan.trialDurationInDays || 30;
          trialEndsAt.setDate(trialEndsAt.getDate() + trialDuration);
          expiresAt.setDate(expiresAt.getDate() + trialDuration);
        }

        const hasUsedTrialBefore = await db.subscription.findFirst({
          where: {
            studentProfileId: existingUser.studentProfile.id,
            isTrial: true,
          },
        });

        const isTrial = subscriptionPlan.isTrial && !hasUsedTrialBefore;

        if (existingSubscription) {
          await db.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              subscriptionPlanId,
              status: "ACTIVE",
              expiresAt,
              trialStartedAt: isTrial
                ? trialStartedAt
                : existingSubscription.trialStartedAt,
              trialEndsAt: isTrial
                ? trialEndsAt
                : existingSubscription.trialEndsAt,
            },
          });
        } else {
          await db.subscription.create({
            data: {
              studentProfileId: existingUser.studentProfile.id,
              subscriptionPlanId,
              expiresAt,
              status: "ACTIVE",
              isTrial,
              trialStartedAt,
              trialEndsAt,
            },
          });
        }
      }
    }

    const updatedUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.log("ERROR_FROM_UPDATE_USER_API", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update user.", error: errorMessage },
      { status: 400 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
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

    const userSubscription = await db.subscription.findFirst({
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to get user.", error: errorMessage },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: { select: { id: true } },
        studentProfile: { select: { id: true } },
        wallet: { select: { id: true } },
        affiliateProfile: { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.wallet) {
      await deleteWallet(user.wallet.id);
    }

    if (user.studentProfile) {
      await deleteStudentProfile(user.studentProfile.id);
    }

    if (user.teacherProfile) {
      await deleteTeacherProfile(user.teacherProfile.id);
    }

    if (user.affiliateProfile) {
      await deleteAffiliateProfile(user.affiliateProfile.id);
    }

    await db.referral.deleteMany({
      where: {
        OR: [{ referrerUserId: userId }, { refereeUserId: userId }],
      },
    });

    await db.eventRegistration.deleteMany({
      where: { userId },
    });

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

async function deleteWallet(walletId: string) {
  await db.$transaction([
    db.walletTransaction.deleteMany({
      where: { walletId },
    }),
    db.creditLot.deleteMany({
      where: { walletId },
    }),
    db.wallet.delete({
      where: { id: walletId },
    }),
  ]);
}

async function deleteStudentProfile(studentProfileId: string) {
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

  await db.comment.deleteMany({
    where: { studentProfileId },
  });

  await db.$transaction([
    db.rating.deleteMany({
      where: { studentProfileId },
    }),
    db.review.deleteMany({
      where: { studentProfileId },
    }),
  ]);

  await db.progress.deleteMany({
    where: { studentProfileId },
  });

  await db.enrolledStudents.deleteMany({
    where: { studentProfileId },
  });

  await db.subscription.deleteMany({
    where: { studentProfileId },
  });

  await db.purchaseHistory.deleteMany({
    where: { studentProfileId },
  });

  const purchases = await db.purchase.findMany({
    where: { studentProfileId },
    select: { id: true },
  });

  if (purchases.length > 0) {
    const purchaseIds = purchases.map((p) => p.id);

    await db.$transaction([
      db.creditPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.mobilePayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.cashPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.cardPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.referrerCommission.deleteMany({
        where: { sourcePurchaseId: { in: purchaseIds } },
      }),
      db.affiliateEarning.deleteMany({
        where: { sourcePurchaseId: { in: purchaseIds } },
      }),
      db.teacherRevenue.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.purchase.deleteMany({
        where: { id: { in: purchaseIds } },
      }),
    ]);
  }

  await db.studentProfile.delete({
    where: { id: studentProfileId },
  });
}

async function deleteTeacherProfile(teacherProfileId: string) {
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

  await db.bankAccount.deleteMany({
    where: { teacherProfileId },
  });

  await db.payoutRequest.deleteMany({
    where: { teacherProfileId },
  });

  const purchases = await db.purchase.findMany({
    where: { teacherProfileId },
    select: { id: true },
  });

  if (purchases.length > 0) {
    const purchaseIds = purchases.map((p) => p.id);

    await db.$transaction([
      db.creditPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.mobilePayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.cashPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.cardPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.referrerCommission.deleteMany({
        where: { sourcePurchaseId: { in: purchaseIds } },
      }),
      db.affiliateEarning.deleteMany({
        where: { sourcePurchaseId: { in: purchaseIds } },
      }),
      db.teacherRevenue.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.purchase.deleteMany({
        where: { id: { in: purchaseIds } },
      }),
    ]);
  }

  const courses = await db.course.findMany({
    where: { teacherProfileId },
    select: { id: true },
  });

  if (courses.length > 0) {
    const courseIds = courses.map((c) => c.id);
    await deleteCoursesAndRelatedData(courseIds);
  }

  const certifications = await db.certification.findMany({
    where: { teacherProfileId },
    select: { id: true },
  });

  if (certifications.length > 0) {
    const certificationIds = certifications.map((c) => c.id);
    await deleteCertificationsAndRelatedData(certificationIds);
  }

  await db.courseRoadmap.deleteMany({
    where: { teacherId: teacherProfileId },
  });

  await db.course.updateMany({
    where: { coTeacherIds: { has: teacherProfileId } },
    data: { coTeacherIds: [] },
  });

  await db.certification.updateMany({
    where: { coTeacherIds: { has: teacherProfileId } },
    data: { coTeacherIds: [] },
  });

  await db.teacherProfile.delete({
    where: { id: teacherProfileId },
  });
}

async function deleteAffiliateProfile(affiliateProfileId: string) {
  await db.$transaction([
    db.affiliateEarning.deleteMany({
      where: { affiliateProfileId },
    }),
    db.bankAccount.deleteMany({
      where: { affiliateProfileId },
    }),
    db.payoutRequest.deleteMany({
      where: { affiliateProfileId },
    }),
    db.affiliateProfile.delete({
      where: { id: affiliateProfileId },
    }),
  ]);
}

async function deleteCoursesAndRelatedData(courseIds: string[]) {
  const lessons = await db.lesson.findMany({
    where: { courseId: { in: courseIds } },
    select: { id: true },
  });
  const lessonIds = lessons.map((l) => l.id);

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
    db.liveSchedule.deleteMany({
      where: { courseId: { in: courseIds } },
    }),
  ]);

  const purchases = await db.purchase.findMany({
    where: { courseId: { in: courseIds } },
    select: { id: true },
  });

  if (purchases.length > 0) {
    const purchaseIds = purchases.map((p) => p.id);

    await db.$transaction([
      db.creditPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.mobilePayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.cashPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.cardPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.referrerCommission.deleteMany({
        where: { sourcePurchaseId: { in: purchaseIds } },
      }),
      db.affiliateEarning.deleteMany({
        where: { sourcePurchaseId: { in: purchaseIds } },
      }),
      db.teacherRevenue.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.purchase.deleteMany({
        where: { id: { in: purchaseIds } },
      }),
    ]);
  }

  await db.bkashPurchaseHistory.deleteMany({
    where: { courseId: { in: courseIds } },
  });

  await db.price.deleteMany({
    where: { courseId: { in: courseIds } },
  });

  const bundles = await db.bundle.findMany({
    where: { courseIds: { hasSome: courseIds } },
    select: { id: true, courseIds: true },
  });

  for (const bundle of bundles) {
    const updatedCourseIds = bundle.courseIds.filter(
      (id) => !courseIds.includes(id)
    );
    await db.bundle.update({
      where: { id: bundle.id },
      data: { courseIds: updatedCourseIds },
    });
  }

  const membershipPlans = await db.membershipPlan.findMany({
    where: { courseIds: { hasSome: courseIds } },
    select: { id: true, courseIds: true },
  });

  for (const plan of membershipPlans) {
    const updatedCourseIds = plan.courseIds.filter(
      (id) => !courseIds.includes(id)
    );
    await db.membershipPlan.update({
      where: { id: plan.id },
      data: { courseIds: updatedCourseIds },
    });
  }

  const certifications = await db.certification.findMany({
    where: { courseIds: { hasSome: courseIds } },
    select: { id: true, courseIds: true },
  });

  for (const cert of certifications) {
    const updatedCourseIds = cert.courseIds.filter(
      (id) => !courseIds.includes(id)
    );
    await db.certification.update({
      where: { id: cert.id },
      data: { courseIds: updatedCourseIds },
    });
  }

  await db.course.deleteMany({
    where: { id: { in: courseIds } },
  });
}

async function deleteCertificationsAndRelatedData(certificationIds: string[]) {
  await db.$transaction([
    db.enrolledStudents.deleteMany({
      where: { certificationId: { in: certificationIds } },
    }),
    db.price.deleteMany({
      where: { certificationId: { in: certificationIds } },
    }),
  ]);

  const purchases = await db.purchase.findMany({
    where: { certificationId: { in: certificationIds } },
    select: { id: true },
  });

  if (purchases.length > 0) {
    const purchaseIds = purchases.map((p) => p.id);

    await db.$transaction([
      db.creditPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.mobilePayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.cashPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.cardPayment.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.referrerCommission.deleteMany({
        where: { sourcePurchaseId: { in: purchaseIds } },
      }),
      db.affiliateEarning.deleteMany({
        where: { sourcePurchaseId: { in: purchaseIds } },
      }),
      db.teacherRevenue.deleteMany({
        where: { purchaseId: { in: purchaseIds } },
      }),
      db.purchase.deleteMany({
        where: { id: { in: purchaseIds } },
      }),
    ]);
  }

  await db.bkashPurchaseHistory.deleteMany({
    where: { certificationId: { in: certificationIds } },
  });

  await db.certification.deleteMany({
    where: { id: { in: certificationIds } },
  });
}
