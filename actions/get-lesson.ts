// actions/get-lesson.ts
"use server";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

interface GetLessonProps {
  userId: string;
  courseSlug: string;
  lessonSlug: string;
}

type LessonResult = Prisma.LessonGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    description: true;
    textContent: true;
    videoUrl: true;
    videoStatus: true;
    position: true;
    isPublished: true;
    isFree: true;
    duration: true;
    courseId: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

type CourseResult = Prisma.CourseGetPayload<{
  select: {
    id: true;
    prices: true;
  };
}>;

type AttachmentResult = Prisma.AttachmentGetPayload<{
  select: {
    id: true;
    name: true;
    url: true;
    courseId: true;
  };
}>;

type ProgressResult = Prisma.ProgressGetPayload<{
  select: {
    id: true;
    studentProfileId: true;
    lessonId: true;
    isCompleted: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

type EnrollmentResult = Prisma.EnrolledStudentsGetPayload<{
  select: {
    id: true;
    studentProfileId: true;
    courseId: true;
  };
}>;

export const getLesson = async ({
  userId,
  courseSlug,
  lessonSlug,
}: GetLessonProps) => {
  try {
    // Get the course
    const course = await db.course.findUnique({
      where: {
        slug: courseSlug,
        isPublished: true,
      },
      select: {
        id: true,
        prices: true,
      },
    });

    if (!course) {
      throw new Error("Course not found or not published");
    }

    // Get student profile
    const studentProfile = await db.studentProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!studentProfile) {
      throw new Error("Student profile not found");
    }

    // Check if student is enrolled in the course
    const enrollment = await db.enrolledStudents.findFirst({
      where: {
        studentProfileId: studentProfile.id,
        courseId: course.id,
      },
      select: {
        id: true,
        studentProfileId: true,
        courseId: true,
      },
    });

    // Get the lesson - using courseId and slug composite unique constraint
    const lesson = await db.lesson.findUnique({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: lessonSlug,
        },
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        textContent: true,
        videoUrl: true,
        videoStatus: true,
        position: true,
        isPublished: true,
        isFree: true,
        duration: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found or not published");
    }

    let attachments: AttachmentResult[] = [];
    let nextLesson: LessonResult | null = null;

    // Get attachments if enrolled
    if (enrollment) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: course.id,
        },
        select: {
          id: true,
          name: true,
          url: true,
          courseId: true,
        },
      });
    }

    // Get next lesson if lesson is free or user is enrolled
    if (lesson.isFree || enrollment) {
      nextLesson = await db.lesson.findFirst({
        where: {
          courseId: course.id,
          isPublished: true,
          position: {
            gt: lesson.position,
          },
        },
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          textContent: true,
          videoUrl: true,
          videoStatus: true,
          position: true,
          isPublished: true,
          isFree: true,
          duration: true,
          courseId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    // Get progress
    const progress = await db.progress.findUnique({
      where: {
        studentProfileId_lessonId: {
          studentProfileId: studentProfile.id,
          lessonId: lesson.id,
        },
      },
      select: {
        id: true,
        studentProfileId: true,
        lessonId: true,
        isCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      lesson,
      course,
      attachments,
      nextLesson,
      progress,
      purchase: enrollment,
    };
  } catch (error) {
    console.error("[GET_LESSON_ERROR]", error);
    return {
      lesson: null,
      course: null,
      attachments: [],
      nextLesson: null,
      progress: null,
      purchase: null,
    };
  }
};
