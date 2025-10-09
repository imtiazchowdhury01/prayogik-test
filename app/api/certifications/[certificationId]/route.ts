//@ts-nocheck
export const dynamic = "force-dynamic";

import { useStudentProfile } from "@/hooks/useStudentProfile";
import { deleteImageFromS3 } from "@/actions/upload-aws";
import {
  useCoTeacherProfileId,
  useTeacherProfile,
} from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";
import { updateCertificationCoursesBatch } from "@/lib/certifications";

export async function GET(req: any, { params }: any) {
  try {
    const { certificationId } = params;
    if (!certificationId) {
      throw new Error(
        "Failed to fetch the certification. Missing certificationId."
      );
    }
    const { userId } = await getServerUserSession();

    if (!userId) {
      throw new Error("User not found");
    }

    const studentProfileId = await useStudentProfile(userId);

    // Fetch certification details with related data
    const certification = await db.certification.findUnique({
      where: {
        id: certificationId,
      },
      include: {
        purchases: userId
          ? {
              where: {
                studentProfileId,
              },
            }
          : false,
        courses: {
          where: {
            isPublished: true,
          },
          include: {
            lessons: {
              where: {
                isPublished: true,
              },
              include: userId
                ? {
                    Progress: {
                      where: {
                        studentProfileId,
                      },
                    },
                  }
                : null,
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

    // Calculate certification progress if user has purchased it
    let progress = null;
    let completedCoursesCount = 0;
    const isPurchased =
      certification.purchases && certification.purchases.length > 0;

    if (userId && isPurchased && certification.courses.length > 0) {
      // Get student's enrolled courses that are part of this certification
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

      const enrolledCourseIds: any = enrolledCertificationCourses.map(
        (e) => e.courseId
      );

      // Count completed courses (100% progress)
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
              studentProfile: {
                userId,
              },
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
    console.log("SINGLE_CERTIFICATION_ERROR:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { certificationId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    // Check if userId is available
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherProfileId = await useTeacherProfile(userId);

    // Fetch the certification associated with the user (teacher)
    const certification = await db.certification.findUnique({
      where: {
        id: params.certificationId,
        teacherProfileId, // Ensure that the user (teacher) owns the certification
      },
      include: {
        purchases: true, // Include purchases to check if anyone has bought it
        courses: {
          include: {
            enrolledStudents: true, // Check if courses have enrolled students
          },
        },
      },
    });

    if (!certification) {
      return new NextResponse("Certification not found", { status: 404 });
    }

    // Check if certification has been purchased
    if (certification.purchases.length > 0) {
      throw new Error(
        "Cannot delete certification that has been purchased by students."
      );
    }

    // Check if any associated courses have enrolled students
    const hasEnrolledStudents = certification.courses.some(
      (course) => course.enrolledStudents.length > 0
    );

    if (hasEnrolledStudents) {
      throw new Error(
        "Cannot delete certification with courses that have enrolled students."
      );
    }

    // Delete certification image from S3 if exists
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

    // Delete the certification
    const deletedCertification = await db.certification.delete({
      where: {
        id: params.certificationId,
      },
    });

    return NextResponse.json(deletedCertification);
  } catch (error: any) {
    console.error("DELETE_CERTIFICATION_ERROR:", error.message);
    return new NextResponse(error.message, { status: 400 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { certificationId: string } }
) {
  const { userId } = await request.json();
  const { certificationId } = params;

  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const studentProfileId = await useStudentProfile(userId);

    // Check if user has purchased the certification
    const purchase = await db.purchase.findFirst({
      where: {
        studentProfileId,
        certificationId,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Certification not purchased" },
        { status: 403 }
      );
    }

    // Get certification with courses
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
      throw new Error("Certification not found");
    }

    // Get student's enrolled courses that are part of this certification
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

    const enrolledCourseIds: any = enrolledCertificationCourses.map(
      (e) => e.courseId
    );
    let completedCoursesCount = 0;

    // Count completed courses (100% progress)
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
            studentProfile: {
              userId,
            },
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
    console.error("CERTIFICATION_PROGRESS_ERROR:", error);
    return NextResponse.json(
      { error: "Error fetching certification progress" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { certificationId: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);
    const { certificationId } = params;

    // Parse the request body
    const values = await req.json();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure at least one field is present to update
    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    const teacherProfileId = await useTeacherProfile(userId);

    if (!isAdmin && !teacherProfileId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Build where clause based on role
    let whereClause: any = {
      id: certificationId,
    };

    // If user is not admin, add teacher/co-teacher restrictions
    if (!isAdmin) {
      whereClause.OR = [];

      if (teacherProfileId) {
        whereClause.OR.push({ teacherProfileId });
      }
    }

    const existingCertification = await db.certification.findUnique({
      where: whereClause,
      include: {
        skills: true,
        courses: true,
      },
    });

    // If the certification is not found, return a 404 response
    if (!existingCertification) {
      return new NextResponse("Not found", { status: 404 });
    }

    const certificationUpdateData = values;

    if (values?.courseIds) {
      await updateCertificationCoursesBatch(
        certificationId,
        values?.courseIds,
        existingCertification?.courseIds
      );
    }

    // Get current coTeacherIds from the existing certification
    const currentCoTeachers = existingCertification.coTeacherIds || [];

    // Handle co-teacher assignment/unassignment if coTeacherIds is being updated
    if (values.coTeacherIds !== undefined) {
      const newCoTeachers = values.coTeacherIds || [];

      // Handle empty array case explicitly
      if (newCoTeachers.length === 0) {
        // Remove certificationId from all current co-teachers
        if (currentCoTeachers.length > 0) {
          for (const coTeacherId of currentCoTeachers) {
            try {
              const existingProfile = await db.teacherProfile.findUnique({
                where: { id: coTeacherId },
                select: { coTeachingCertificationIds: true },
              });

              if (existingProfile) {
                const updatedCertificationIds = (
                  existingProfile.coTeachingCertificationIds || []
                ).filter((id: string) => id !== certificationId);

                await db.teacherProfile.update({
                  where: { id: coTeacherId },
                  data: {
                    coTeachingCertificationIds: updatedCertificationIds,
                  },
                });
              }
            } catch (error) {
              console.error(
                `Error removing certificationId from teacher ${coTeacherId}:`,
                error
              );
            }
          }
        }
      } else {
        // Find teachers to add and remove
        const teachersToAdd = newCoTeachers.filter(
          (id: string) => !currentCoTeachers.includes(id)
        );

        const teachersToRemove = currentCoTeachers.filter(
          (id: string) => !newCoTeachers.includes(id)
        );

        // Add certificationId to new co-teachers
        if (teachersToAdd.length > 0) {
          for (const coTeacherId of teachersToAdd) {
            try {
              const existingProfile = await db.teacherProfile.findUnique({
                where: { id: coTeacherId },
                select: { coTeachingCertificationIds: true },
              });

              if (existingProfile) {
                const updatedCertificationIds = Array.from(
                  new Set([
                    ...(existingProfile.coTeachingCertificationIds || []),
                    certificationId,
                  ])
                );

                await db.teacherProfile.update({
                  where: { id: coTeacherId },
                  data: {
                    coTeachingCertificationIds: updatedCertificationIds,
                  },
                });
              }
            } catch (error) {
              console.error(
                `Error adding certificationId to teacher ${coTeacherId}:`,
                error
              );
            }
          }
        }

        // Remove certificationId from removed co-teachers
        if (teachersToRemove.length > 0) {
          for (const coTeacherId of teachersToRemove) {
            try {
              const existingProfile = await db.teacherProfile.findUnique({
                where: { id: coTeacherId },
                select: { coTeachingCertificationIds: true },
              });

              if (existingProfile) {
                const updatedCertificationIds = (
                  existingProfile.coTeachingCertificationIds || []
                ).filter((id: string) => id !== certificationId);

                await db.teacherProfile.update({
                  where: { id: coTeacherId },
                  data: {
                    coTeachingCertificationIds: updatedCertificationIds,
                  },
                });
              }
            } catch (error) {
              console.error(
                `Error removing certificationId from teacher ${coTeacherId}:`,
                error
              );
            }
          }
        }
      }
    }

    // Update the certification with the provided fields (excluding FAQs)
    const updatedCertification = await db.certification.update({
      where: {
        id: certificationId,
      },
      data: certificationUpdateData,
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
    console.error("[CERTIFICATION_ID_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
