// api/certifications/[certificationId]/route.ts
export const dynamic = "force-dynamic";

import { useStudentProfile } from "@/hooks/useStudentProfile";
import { deleteImageFromS3 } from "@/actions/upload-aws";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";
import { updateCertificationCoursesBatch } from "@/lib/certifications";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    certificationId: string;
  };
}

interface ProgressRequest {
  userId: string;
}

interface UpdateCertificationRequest {
  coTeacherIds?: string[];
  courseIds?: string[];
  [key: string]: any;
}

interface ProgressResponse {
  progress: number;
  completedCourses: number;
  totalCourses: number;
}

// ========== GET HANDLER ==========

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { certificationId } = params;

    if (!certificationId) {
      return NextResponse.json(
        { error: true, message: "Missing certificationId" },
        { status: 400 }
      );
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        { error: true, message: "User not found" },
        { status: 401 }
      );
    }

    const studentProfileId = await useStudentProfile(userId);

    // Fetch certification with all data
    const certification = await db.certification.findUnique({
      where: { id: certificationId },
      include: {
        purchases: studentProfileId
          ? {
              where: {
                studentProfileId,
                paymentStatus: "COMPLETED",
              },
            }
          : true,
        courses: {
          where: {
            isPublished: true,
          },
          include: {
            lessons: {
              where: {
                isPublished: true,
              },
              include: studentProfileId
                ? {
                    Progress: {
                      where: {
                        studentProfileId,
                      },
                    },
                  }
                : {},
              orderBy: {
                position: "asc",
              },
            },
            attachments: true,
            teacherProfile: {
              select: {
                user: {
                  select: {
                    name: true,
                    username: true,
                  },
                },
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
          },
        },
        skills: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        teacherProfile: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        coTeachers: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        prices: true,
      },
    });

    if (!certification) {
      return NextResponse.json(
        { error: true, message: "Certification not found" },
        { status: 404 }
      );
    }

    // Calculate certification progress
    let progress: number | null = null;
    let completedCoursesCount = 0;

    // Filter purchases if not filtered by query
    const relevantPurchases = studentProfileId
      ? certification.purchases.filter(
          (p) => p.studentProfileId === studentProfileId
        )
      : certification.purchases;

    const isPurchased = relevantPurchases.length > 0;

    if (
      userId &&
      studentProfileId &&
      isPurchased &&
      certification.courses.length > 0
    ) {
      const enrolledCertificationCourses = await db.enrolledStudents.findMany({
        where: {
          studentProfileId,
          courseId: {
            in: certification.courses.map((c) => c.id),
          },
        },
        select: {
          courseId: true,
        },
      });

      const enrolledCourseIds = enrolledCertificationCourses
        .map((e) => e.courseId)
        .filter((id): id is string => id !== null);

      for (const courseId of enrolledCourseIds) {
        const totalLessons = await db.lesson.count({
          where: {
            courseId,
            isPublished: true,
          },
        });

        if (totalLessons > 0) {
          const completedLessons = await db.progress.count({
            where: {
              isCompleted: true,
              lesson: {
                courseId,
                isPublished: true,
              },
              studentProfile: { userId },
            },
          });

          if (completedLessons >= totalLessons) {
            completedCoursesCount++;
          }
        }
      }

      if (certification.courses.length > 0) {
        progress = Math.ceil(
          (completedCoursesCount / certification.courses.length) * 100
        );
      }
    }

    const certificationWithProgress = {
      ...certification,
      progress,
      completedCoursesCount,
      totalCoursesCount: certification.courses.length,
      isPurchased,
    };

    return NextResponse.json(certificationWithProgress);
  } catch (error: any) {
    console.error("[GET_CERTIFICATION_ERROR]", error);
    return NextResponse.json(
      {
        error: true,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// ========== DELETE HANDLER ==========

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { certificationId } = params;

    if (!certificationId) {
      return new NextResponse("Missing certificationId", { status: 400 });
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherProfileId = await useTeacherProfile(userId);

    if (!teacherProfileId) {
      return new NextResponse("Teacher profile not found", { status: 404 });
    }

    const certification = await db.certification.findUnique({
      where: {
        id: certificationId,
        teacherProfileId,
      },
      include: {
        purchases: {
          where: {
            paymentStatus: "COMPLETED",
          },
        },
        courses: {
          include: {
            enrolledStudents: true,
          },
        },
      },
    });

    if (!certification) {
      return new NextResponse("Certification not found", { status: 404 });
    }

    if (certification.purchases.length > 0) {
      return new NextResponse(
        "Cannot delete certification that has been purchased by students.",
        { status: 400 }
      );
    }

    const hasEnrolledStudents = certification.courses.some(
      (course) => course.enrolledStudents.length > 0
    );

    if (hasEnrolledStudents) {
      return new NextResponse(
        "Cannot delete certification with courses that have enrolled students.",
        { status: 400 }
      );
    }

    if (certification.imageUrl) {
      try {
        const imageKey = certification.imageUrl.split(".amazonaws.com/")[1];
        if (imageKey) {
          await deleteImageFromS3(imageKey);
        }
      } catch (error) {
        console.error("Failed to delete certification image:", error);
      }
    }

    const deletedCertification = await db.certification.delete({
      where: { id: certificationId },
    });

    return NextResponse.json(deletedCertification);
  } catch (error: any) {
    console.error("[DELETE_CERTIFICATION_ERROR]", error);
    return new NextResponse(error?.message || "Internal Error", {
      status: 500,
    });
  }
}

// ========== POST HANDLER (Get Progress) ==========

export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ProgressResponse | { error: string }>> {
  try {
    const { certificationId } = params;
    const body: ProgressRequest = await request.json();
    const { userId } = body;

    if (!userId || !certificationId) {
      return NextResponse.json(
        { error: "Missing userId or certificationId" },
        { status: 400 }
      );
    }

    const studentProfileId = await useStudentProfile(userId);

    if (!studentProfileId) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const purchase = await db.purchase.findFirst({
      where: {
        studentProfileId,
        certificationId,
        paymentStatus: "COMPLETED",
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Certification not purchased" },
        { status: 403 }
      );
    }

    const certification = await db.certification.findUnique({
      where: { id: certificationId },
      include: {
        courses: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!certification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    const enrolledCertificationCourses = await db.enrolledStudents.findMany({
      where: {
        studentProfileId,
        courseId: {
          in: certification.courses.map((c) => c.id),
        },
      },
      select: {
        courseId: true,
      },
    });

    const enrolledCourseIds = enrolledCertificationCourses
      .map((e) => e.courseId)
      .filter((id): id is string => id !== null);

    let completedCoursesCount = 0;

    for (const courseId of enrolledCourseIds) {
      const totalLessons = await db.lesson.count({
        where: {
          courseId,
          isPublished: true,
        },
      });

      if (totalLessons > 0) {
        const completedLessons = await db.progress.count({
          where: {
            isCompleted: true,
            lesson: {
              courseId,
              isPublished: true,
            },
            studentProfile: { userId },
          },
        });

        if (completedLessons >= totalLessons) {
          completedCoursesCount++;
        }
      }
    }

    const progressPercentage =
      certification.courses.length > 0
        ? Math.ceil(
            (completedCoursesCount / certification.courses.length) * 100
          )
        : 0;

    return NextResponse.json({
      progress: progressPercentage,
      completedCourses: completedCoursesCount,
      totalCourses: certification.courses.length,
    });
  } catch (error: any) {
    console.error("[CERTIFICATION_PROGRESS_ERROR]", error);
    return NextResponse.json(
      { error: "Error fetching certification progress" },
      { status: 500 }
    );
  }
}

// ========== PATCH HANDLER ==========

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { certificationId } = params;

    if (!certificationId) {
      return new NextResponse("Missing certificationId", { status: 400 });
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const values: UpdateCertificationRequest = await req.json();

    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    const teacherProfileId = await useTeacherProfile(userId);

    if (!isAdmin && !teacherProfileId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const whereConditions: any[] = [{ id: certificationId }];

    if (!isAdmin && teacherProfileId) {
      whereConditions.push({ teacherProfileId });
    }

    const existingCertification = await db.certification.findFirst({
      where: {
        AND: whereConditions,
      },
      include: {
        skills: true,
        courses: true,
      },
    });

    if (!existingCertification) {
      return new NextResponse("Certification not found", { status: 404 });
    }

    if (values.courseIds) {
      await updateCertificationCoursesBatch(
        certificationId,
        values.courseIds,
        existingCertification.courseIds
      );
    }

    const currentCoTeachers = existingCertification.coTeacherIds || [];

    if (values.coTeacherIds !== undefined) {
      const newCoTeachers = values.coTeacherIds || [];

      if (newCoTeachers.length === 0) {
        for (const coTeacherId of currentCoTeachers) {
          await updateCoTeacherCertificationIds(
            coTeacherId,
            certificationId,
            "remove"
          );
        }
      } else {
        const teachersToAdd = newCoTeachers.filter(
          (id) => !currentCoTeachers.includes(id)
        );
        const teachersToRemove = currentCoTeachers.filter(
          (id) => !newCoTeachers.includes(id)
        );

        for (const coTeacherId of teachersToAdd) {
          await updateCoTeacherCertificationIds(
            coTeacherId,
            certificationId,
            "add"
          );
        }

        for (const coTeacherId of teachersToRemove) {
          await updateCoTeacherCertificationIds(
            coTeacherId,
            certificationId,
            "remove"
          );
        }
      }
    }

    const updatedCertification = await db.certification.update({
      where: { id: certificationId },
      data: values,
      include: {
        skills: true,
        courses: {
          where: {
            isPublished: true,
          },
        },
        teacherProfile: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        coTeachers: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        prices: true,
      },
    });

    return NextResponse.json(updatedCertification);
  } catch (error) {
    console.error("[UPDATE_CERTIFICATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// ========== HELPER FUNCTIONS ==========

async function updateCoTeacherCertificationIds(
  coTeacherId: string,
  certificationId: string,
  action: "add" | "remove"
): Promise<void> {
  try {
    const existingProfile = await db.teacherProfile.findUnique({
      where: { id: coTeacherId },
      select: { coTeachingCertificationIds: true },
    });

    if (!existingProfile) return;

    const currentCertificationIds =
      existingProfile.coTeachingCertificationIds || [];

    const updatedCertificationIds =
      action === "add"
        ? Array.from(new Set([...currentCertificationIds, certificationId]))
        : currentCertificationIds.filter((id) => id !== certificationId);

    await db.teacherProfile.update({
      where: { id: coTeacherId },
      data: { coTeachingCertificationIds: updatedCertificationIds },
    });
  } catch (error) {
    console.error(
      `Error ${action}ing certificationId ${
        action === "add" ? "to" : "from"
      } teacher ${coTeacherId}:`,
      error
    );
  }
}
