// api/admin/courses/[courseId]/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;

    if (!courseId) {
      throw new Error("Failed to fetch the course. Missing courseId.");
    }
    const { isAdmin } = await getServerUserSession();

    if (!isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        prices: true,
        liveSchedules: true,
        lessons: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        coTeachers: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: true,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        attachments: true,
        lessons: true,
        enrolledStudents: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    if (course.enrolledStudents.length > 0) {
      throw new Error("Cannot delete course with enrolled students.");
    }

    await db.liveSchedule.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    if (course.attachments.length > 0) {
      await db.attachment.deleteMany({
        where: {
          courseId: params.courseId,
        },
      });
    }

    if (course.lessons.length > 0) {
      for (const lesson of course.lessons) {
        const videoId = lesson.videoUrl;

        if (videoId) {
          const apiSecret = process.env.VDOCIPHER_API_SECRET;

          if (!apiSecret) {
            throw new Error("API Secret is not defined.");
          }

          const url = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;

          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Apisecret ${apiSecret}`,
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Response from VdoCipher: ${errorText}`);
            throw new Error(
              `Failed to delete video ${videoId}: ${response.status} - ${errorText}`
            );
          }
        }
      }

      await db.lesson.deleteMany({
        where: {
          courseId: params.courseId,
        },
      });
    }

    await db.price.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    await db.$transaction([
      db.rating.deleteMany({
        where: { courseId: params.courseId },
      }),
      db.review.deleteMany({
        where: { courseId: params.courseId },
      }),
      db.comment.deleteMany({
        where: { courseId: params.courseId },
      }),
    ]);

    const purchases = await db.purchase.findMany({
      where: { courseId: params.courseId },
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
      where: { courseId: params.courseId },
    });

    const bundles = await db.bundle.findMany({
      where: { courseIds: { has: params.courseId } },
      select: { id: true, courseIds: true },
    });

    for (const bundle of bundles) {
      const updatedCourseIds = bundle.courseIds.filter(
        (id) => id !== params.courseId
      );
      await db.bundle.update({
        where: { id: bundle.id },
        data: { courseIds: updatedCourseIds },
      });
    }

    const membershipPlans = await db.membershipPlan.findMany({
      where: { courseIds: { has: params.courseId } },
      select: { id: true, courseIds: true },
    });

    for (const plan of membershipPlans) {
      const updatedCourseIds = plan.courseIds.filter(
        (id) => id !== params.courseId
      );
      await db.membershipPlan.update({
        where: { id: plan.id },
        data: { courseIds: updatedCourseIds },
      });
    }

    const certifications = await db.certification.findMany({
      where: { courseIds: { has: params.courseId } },
      select: { id: true, courseIds: true },
    });

    for (const cert of certifications) {
      const updatedCourseIds = cert.courseIds.filter(
        (id) => id !== params.courseId
      );
      await db.certification.update({
        where: { id: cert.id },
        data: { courseIds: updatedCourseIds },
      });
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(errorMessage);
    return new NextResponse(errorMessage, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    const values = await req.json();

    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    const existingCourse = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        coTeacherIds: true,
      },
    });

    if (!existingCourse) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (values.coTeacherIds !== undefined) {
      const currentCoTeachers = existingCourse.coTeacherIds || [];
      const newCoTeachers = values.coTeacherIds || [];

      const teachersToAdd = newCoTeachers.filter(
        (id: string) => !currentCoTeachers.includes(id)
      );

      const teachersToRemove = currentCoTeachers.filter(
        (id: string) => !newCoTeachers.includes(id)
      );

      for (const coTeacherId of teachersToAdd) {
        const existingProfile = await db.teacherProfile.findUnique({
          where: { id: coTeacherId },
          select: { coTeachingCourseIds: true },
        });

        if (existingProfile) {
          const updatedCourseIds = Array.from(
            new Set([...(existingProfile.coTeachingCourseIds || []), courseId])
          );

          await db.teacherProfile.update({
            where: { id: coTeacherId },
            data: {
              coTeachingCourseIds: updatedCourseIds,
            },
          });
        }
      }

      for (const coTeacherId of teachersToRemove) {
        const existingProfile = await db.teacherProfile.findUnique({
          where: { id: coTeacherId },
          select: { coTeachingCourseIds: true },
        });

        if (existingProfile) {
          const updatedCourseIds = (
            existingProfile.coTeachingCourseIds || []
          ).filter((id: string) => id !== courseId);

          await db.teacherProfile.update({
            where: { id: coTeacherId },
            data: {
              coTeachingCourseIds: updatedCourseIds,
            },
          });
        }
      }
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSE_ID_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
