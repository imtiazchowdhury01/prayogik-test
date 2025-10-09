// api/courses/[courseId]/lessons/[lessonId]/route.ts
import {
  useCoTeacherProfileId,
  useCourseByTeacherOrCoTeacher,
  useTeacherProfile,
} from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";
import updateCourseDuration from "@/lib/utils/updateCourseDuration";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    courseId: string;
    lessonId: string;
  };
}

interface UpdateLessonRequest {
  videoUrl?: string;
  duration?: number;
  slug?: string;
  [key: string]: any;
}

interface ErrorResponse {
  error: string;
}

type Lesson = Prisma.LessonGetPayload<{}>;

// ========== GET HANDLER ==========

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Lesson | ErrorResponse>> {
  try {
    const { courseId, lessonId } = params;

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: "Missing courseId or lessonId" },
        { status: 400 }
      );
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      );
    }

    const teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    const teacherProfileId = teacherProfile?.id;
    const coTeacherProfileId = await useCoTeacherProfileId(userId, courseId);

    if (!isAdmin && !teacherProfileId && !coTeacherProfileId) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    // Verify course ownership if not admin
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(userId, courseId);

      if (!ownCourse) {
        return NextResponse.json(
          { error: "Unauthorized access. You do not own this course." },
          { status: 403 }
        );
      }
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
        courseId,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[GET_LESSON_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}

// ========== PATCH HANDLER ==========

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Lesson | ErrorResponse>> {
  try {
    const { courseId, lessonId } = params;

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: "Missing courseId or lessonId" },
        { status: 400 }
      );
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    const teacherProfileId = teacherProfile?.id;
    const coTeacherProfileId = await useCoTeacherProfileId(userId, courseId);

    if (!isAdmin && !teacherProfileId && !coTeacherProfileId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: UpdateLessonRequest = await req.json();
    const { videoUrl, duration, slug, ...values } = body;

    if (videoUrl && typeof videoUrl !== "string") {
      return new NextResponse("Invalid video URL", { status: 400 });
    }

    // Verify ownership if not admin
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(userId, courseId);

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const existingLesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
        courseId,
      },
    });

    if (!existingLesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    // Check slug uniqueness if provided
    if (slug && slug !== existingLesson.slug) {
      const lessonWithSameSlug = await db.lesson.findFirst({
        where: {
          slug,
          courseId,
          id: { not: lessonId },
        },
      });

      if (lessonWithSameSlug) {
        return new NextResponse("Slug already exists", { status: 400 });
      }
    }

    const updatedLesson = await db.lesson.update({
      where: {
        id: lessonId,
        courseId,
      },
      data: {
        ...values,
        ...(slug && { slug }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(duration !== undefined && { duration }),
      },
    });

    // Check if all required fields are filled
    const requiredFields = [
      updatedLesson.title,
      updatedLesson.videoUrl || updatedLesson.textContent,
    ];

    const isComplete = requiredFields.every(Boolean);

    // Unpublish if incomplete
    if (!isComplete && updatedLesson.isPublished) {
      await db.lesson.update({
        where: {
          id: lessonId,
          courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    await updateCourseDuration(courseId);

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error("[UPDATE_LESSON_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ========== DELETE HANDLER ==========

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { courseId, lessonId } = params;

    if (!courseId || !lessonId) {
      return new NextResponse("Missing courseId or lessonId", { status: 400 });
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userIsTeacher = await isTeacher(userId);

    if (!isAdmin && !userIsTeacher) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify ownership if not admin
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(userId, courseId);

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
        courseId,
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson Not Found", { status: 404 });
    }

    // Delete video from VdoCipher if exists
    const videoId = lesson.videoUrl;
    if (videoId) {
      const apiSecret = process.env.VDOCIPHER_API_SECRET;

      if (!apiSecret) {
        return new NextResponse("API Secret is not defined", { status: 500 });
      }

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
          console.error(`VdoCipher error: ${errorText}`);
        }
      } catch (videoError) {
        console.error(`Failed to delete video ${videoId}:`, videoError);
      }
    }

    // Delete associated progress
    await db.progress.deleteMany({
      where: { lessonId: lesson.id },
    });

    // Delete the lesson
    const deletedLesson = await db.lesson.delete({
      where: { id: lessonId },
    });

    // Check remaining published lessons
    const remainingPublishedLessons = await db.lesson.count({
      where: {
        courseId,
        isPublished: true,
      },
    });

    // Unpublish course if no published lessons remain
    if (remainingPublishedLessons === 0) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    await updateCourseDuration(courseId);

    return NextResponse.json(deletedLesson);
  } catch (error) {
    console.error("[DELETE_LESSON_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
