// actions/get-chapter.ts
"use server";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

interface GetLessonProps {
  userId: string;
  courseId: string;
  lessonId: string;
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
  };
}>;

type CourseResult = {
  prices: Prisma.PriceGetPayload<true>[];
};

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

type EnrollmentResult = {
  id: string;
  studentProfileId: string;
  courseId: string | null;
};

type GetLessonResponse = {
  lesson: LessonResult | null;
  course: CourseResult | null;
  attachments: AttachmentResult[];
  nextLesson: LessonResult | null;
  progress: ProgressResult | null;
  purchase: EnrollmentResult | null;
};

export const getLesson = async ({
  userId,
  courseId,
  lessonId,
}: GetLessonProps): Promise<GetLessonResponse> => {
  try {
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
        courseId: courseId,
      },
      select: {
        id: true,
        studentProfileId: true,
        courseId: true,
      },
    });

    // Get course details
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        prices: true,
      },
    });

    // Get lesson details
    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
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
      },
    });

    if (!lesson || !course) {
      throw new Error("Lesson or course not found");
    }

    let attachments: AttachmentResult[] = [];
    let nextLesson: LessonResult | null = null;

    // Get attachments if enrolled
    if (enrollment) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
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
          courseId: courseId,
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
        },
      });
    }

    // Get progress
    const progress = await db.progress.findUnique({
      where: {
        studentProfileId_lessonId: {
          studentProfileId: studentProfile.id,
          lessonId,
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
    console.error("[GET_LESSON]", error);
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
