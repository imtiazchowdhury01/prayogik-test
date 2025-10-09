// api/courses/[courseId]/route.ts
export const dynamic = "force-dynamic";

import { getProgress } from "@/actions/get-progress";
import { deleteImageFromS3 } from "@/actions/upload-aws";
import {
  useCoTeacherProfileId,
  useTeacherProfile,
} from "@/hooks/useTeacherProfile";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { updateCourseCertificationsBatch } from "@/lib/certifications";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { deleteFolderInVdeocipherByCourseId } from "@/lib/utils/vdeocipher";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
  };
}

interface ProgressRequest {
  userId: string;
}

interface CourseUpdateRequest {
  coTeacherIds?: string[];
  liveSchedules?: Array<{
    dayOfWeek:
      | "SATURDAY"
      | "SUNDAY"
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY";
    startTime: string;
    endTime: string;
  }>;
  certificationIds?: string[];
  [key: string]: any;
}

interface ApiErrorResponse {
  error: boolean;
  message: string;
}

interface ProgressResponse {
  progress: number;
}

type CourseWithDeleteData = Prisma.CourseGetPayload<{
  include: {
    attachments: true;
    lessons: true;
    enrolledStudents: true;
  };
}>;

type CourseWithUpdateData = Prisma.CourseGetPayload<{
  include: {
    lessons: true;
    category: true;
    attachments: true;
    liveSchedules: true;
  };
}>;

// ========== GET HANDLER ==========

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { courseId } = params;

    if (!courseId) {
      return NextResponse.json(
        {
          error: true,
          message: "Failed to fetch the course. Missing courseId.",
        },
        { status: 400 }
      );
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        {
          error: true,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    const studentProfileId = await useStudentProfile(userId);

    // Build the query conditionally
    const courseQuery: Prisma.CourseFindUniqueArgs = {
      where: {
        id: courseId,
      },
      include: {
        ...(studentProfileId && {
          purchases: {
            where: {
              studentProfileId,
              paymentStatus: "COMPLETED",
            },
          },
        }),
        lessons: {
          where: {
            isPublished: true,
          },
          ...(studentProfileId && {
            include: {
              Progress: {
                where: {
                  studentProfileId,
                },
              },
            },
          }),
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
              },
            },
          },
        },
      },
    };

    const course = await db.course.findUnique(courseQuery);

    if (!course) {
      return NextResponse.json(
        {
          error: true,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error: any) {
    console.error("[SINGLE_COURSE_ERROR]", error);
    return NextResponse.json(
      {
        error: true,
        message: error?.message || "Internal server error",
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
    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherProfileId = await useTeacherProfile(userId);

    if (!teacherProfileId) {
      return new NextResponse("Unauthorized - Teacher profile not found", {
        status: 401,
      });
    }

    const course: CourseWithDeleteData | null = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId,
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

    const lessonsWithVideos = course.lessons.filter(
      (lesson) => lesson.videoUrl
    );

    if (course.enrolledStudents.length > 0 || lessonsWithVideos.length > 0) {
      const errors: string[] = [];

      if (course.enrolledStudents.length > 0) {
        errors.push("Cannot delete course with enrolled students.");
      }

      if (lessonsWithVideos.length > 0) {
        errors.push(
          "Please delete all lessons with videos first before deleting the course."
        );
      }

      return new NextResponse(errors.join(" "), { status: 400 });
    }

    if (course.imageUrl) {
      try {
        const imageKey = course.imageUrl.split(".amazonaws.com/")[1];
        if (imageKey) {
          await deleteImageFromS3(imageKey);
        }
        await db.course.update({
          where: { id: params.courseId },
          data: { imageUrl: null },
        });
      } catch (error) {
        console.error("Failed to delete course image:", error);
      }
    }

    if (course.attachments.length > 0) {
      for (const attachment of course.attachments) {
        try {
          const attachmentKey = attachment.url?.split(".amazonaws.com/")[1];
          if (attachmentKey) {
            await deleteImageFromS3(attachmentKey);
          }
        } catch (error) {
          console.error(
            `Failed to delete attachment from S3: ${attachment.id}`,
            error
          );
        }
      }

      await db.attachment.deleteMany({
        where: { courseId: params.courseId },
      });
    }

    if (course.lessons.length > 0) {
      const apiSecret = process.env.VDOCIPHER_API_SECRET;

      if (!apiSecret) {
        return new NextResponse("API Secret is not defined", { status: 500 });
      }

      for (const lesson of course.lessons) {
        const videoId = lesson.videoUrl;

        if (videoId) {
          try {
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
            }
          } catch (error) {
            console.error(`Failed to delete video ${videoId}:`, error);
          }
        }
      }

      await db.lesson.deleteMany({
        where: { courseId: params.courseId },
      });
    }

    await deleteFolderInVdeocipherByCourseId(params.courseId);

    const deletedCourse = await db.course.delete({
      where: { id: params.courseId },
    });

    return NextResponse.json(deletedCourse);
  } catch (error: any) {
    console.error("[COURSE_DELETE_ERROR]", error);
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
    const body: ProgressRequest = await request.json();
    const { userId } = body;
    const { courseId } = params;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId" },
        { status: 400 }
      );
    }

    const progressPercentage = await getProgress(userId, courseId);

    return NextResponse.json({ progress: progressPercentage });
  } catch (error) {
    console.error("[GET_PROGRESS_ERROR]", error);
    return NextResponse.json(
      { error: "Error fetching progress" },
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
    const { userId, isAdmin } = await getServerUserSession();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const values: CourseUpdateRequest = await req.json();

    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    const teacherProfileId = await useTeacherProfile(userId);
    const coTeacherProfileId = await useCoTeacherProfileId(userId, courseId);

    if (!isAdmin && !teacherProfileId && !coTeacherProfileId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Build where clause for findFirst
    const whereConditions: any[] = [{ id: courseId }];

    if (!isAdmin) {
      const orConditions: any[] = [];

      if (teacherProfileId) {
        orConditions.push({ teacherProfileId });
      }

      if (coTeacherProfileId) {
        orConditions.push({
          coTeacherIds: { hasSome: [coTeacherProfileId] },
        });
      }

      if (orConditions.length > 0) {
        whereConditions.push({ OR: orConditions });
      }
    }

    const existingCourse: CourseWithUpdateData | null =
      await db.course.findFirst({
        where: {
          AND: whereConditions,
        },
        include: {
          lessons: true,
          category: true,
          attachments: true,
          liveSchedules: true,
        },
      });

    if (!existingCourse) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const { liveSchedules, ...courseUpdateData } = values;
    const currentCoTeachers = existingCourse.coTeacherIds || [];

    if (values.coTeacherIds !== undefined) {
      const newCoTeachers = values.coTeacherIds || [];

      if (newCoTeachers.length === 0) {
        for (const coTeacherId of currentCoTeachers) {
          await updateCoTeacherCourseIds(coTeacherId, courseId, "remove");
        }
      } else {
        const teachersToAdd = newCoTeachers.filter(
          (id) => !currentCoTeachers.includes(id)
        );
        const teachersToRemove = currentCoTeachers.filter(
          (id) => !newCoTeachers.includes(id)
        );

        for (const coTeacherId of teachersToAdd) {
          await updateCoTeacherCourseIds(coTeacherId, courseId, "add");
        }

        for (const coTeacherId of teachersToRemove) {
          await updateCoTeacherCourseIds(coTeacherId, courseId, "remove");
        }
      }
    }

    if (liveSchedules !== undefined) {
      await db.liveSchedule.deleteMany({
        where: { courseId },
      });

      if (liveSchedules && liveSchedules.length > 0) {
        const scheduleCreateData = liveSchedules.map((schedule) => ({
          courseId,
          dayOfWeek: schedule.dayOfWeek,
          startTime: new Date(schedule.startTime),
          endTime: new Date(schedule.endTime),
        }));

        await db.liveSchedule.createMany({
          data: scheduleCreateData,
        });
      }
    }

    if (values.certificationIds) {
      await updateCourseCertificationsBatch(
        courseId,
        values.certificationIds,
        existingCourse.certificationIds
      );
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: courseUpdateData,
      include: {
        liveSchedules: true,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSE_PATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// ========== HELPER FUNCTIONS ==========

async function updateCoTeacherCourseIds(
  coTeacherId: string,
  courseId: string,
  action: "add" | "remove"
): Promise<void> {
  try {
    const existingProfile = await db.teacherProfile.findUnique({
      where: { id: coTeacherId },
      select: { coTeachingCourseIds: true },
    });

    if (!existingProfile) return;

    const currentCourseIds = existingProfile.coTeachingCourseIds || [];

    const updatedCourseIds =
      action === "add"
        ? Array.from(new Set([...currentCourseIds, courseId]))
        : currentCourseIds.filter((id) => id !== courseId);

    await db.teacherProfile.update({
      where: { id: coTeacherId },
      data: { coTeachingCourseIds: updatedCourseIds },
    });
  } catch (error) {
    console.error(
      `Error ${action}ing courseId ${
        action === "add" ? "to" : "from"
      } teacher ${coTeacherId}:`,
      error
    );
  }
}
