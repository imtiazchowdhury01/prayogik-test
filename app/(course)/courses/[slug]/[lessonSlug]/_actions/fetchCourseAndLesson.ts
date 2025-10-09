// import { db } from "@/lib/db";
// import { getServerUserSession } from "@/lib/getServerUserSession";
// import { notFound } from "next/navigation";

// export async function fetchCourseAndLesson(
//   courseSlug: string,
//   lessonSlug: string
// ) {
//   const { userId } = await getServerUserSession();

//   let studentProfileId: string | null = null;

//   // Fetch student profile if user is logged in
//   if (userId) {
//     const studentProfile = await db.studentProfile.findUnique({
//       where: { userId },
//       select: { id: true },
//     });
//     studentProfileId = studentProfile?.id || null;
//   }
//   // Fetch course with lessons
//   const course = await db.course.findUnique({
//     where: { slug: courseSlug },
//     include: {
//       lessons: {
//         where: { isPublished: true },
//         orderBy: { position: "asc" },
//         include: {
//           Progress: studentProfileId
//             ? {
//                 where: {
//                   studentProfileId: studentProfileId,
//                 },
//               }
//             : false,
//         },
//       },
//       teacherProfile: {
//         include: {
//           user: true,
//         },
//       },
//       attachments: true,
//     },
//   });
//   if (!course || !course.lessons || course.lessons.length === 0) {
//     notFound();
//   }

//   const currentLesson = course.lessons.find(
//     (lesson) => lesson.slug === lessonSlug
//   );

//   if (!currentLesson) {
//     notFound();
//   }

//   // Find next lesson
//   const currentLessonIndex = course.lessons.findIndex(
//     (l) => l.id === currentLesson.id
//   );
//   const nextLesson = course.lessons[currentLessonIndex + 1] || null;

//   return {
//     course: {
//       ...course,
//       totalLessons: course.lessons.length,
//     },
//     lessons: course.lessons,
//     currentLesson,
//     nextLesson,
//     userId,
//     studentProfileId,
//   };
// }

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { notFound } from "next/navigation";

export async function fetchCourseAndLesson(
  courseSlug: string,
  lessonSlug: string
) {
  try {
    const { userId } = await getServerUserSession();

    let studentProfileId: string | null = null;

    // Fetch student profile if user is logged in
    if (userId) {
      const studentProfile = await db.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      studentProfileId = studentProfile?.id || null;
    }

    // Fetch course with lessons
    const course = await db.course.findUnique({
      where: { slug: courseSlug },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { position: "asc" },
          include: {
            Progress: studentProfileId
              ? {
                  where: {
                    studentProfileId: studentProfileId,
                  },
                }
              : false,
          },
        },
        teacherProfile: {
          include: {
            user: true,
          },
        },
        attachments: true,
      },
    });

    if (!course || !course.lessons || course.lessons.length === 0) {
      notFound();
    }

    const currentLesson = course.lessons.find(
      (lesson) => lesson.slug === lessonSlug
    );

    if (!currentLesson) {
      notFound();
    }

    // Check if user is enrolled (purchase check)
    let purchase = null;
    if (studentProfileId) {
      // Use studentProfileId instead of userId
      purchase = await db.enrolledStudents.findFirst({
        where: {
          studentProfileId: studentProfileId,
          courseId: course.id,
        },
      });
    }

    // Get attachments if user has access
    let attachments: any = [];
    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: course.id,
        },
      });
    }

    // Find next lesson based on access
    let nextLesson = null;
    if (currentLesson.isFree || purchase) {
      const currentLessonIndex = course.lessons.findIndex(
        (l) => l.id === currentLesson.id
      );
      nextLesson = course.lessons[currentLessonIndex + 1] || null;
    }

    // Get user progress for current lesson
    let progress = null;
    if (studentProfileId) {
      // Use studentProfileId instead of userId
      progress = await db.progress.findUnique({
        where: {
          studentProfileId_lessonId: {
            studentProfileId: studentProfileId,
            lessonId: currentLesson.id,
          },
        },
      });
    }

    return {
      course: {
        ...course,
        totalLessons: course.lessons.length,
        attachments, // Include attachments in course object
      },
      lessons: course.lessons,
      currentLesson,
      nextLesson,
      userId,
      studentProfileId,
      progress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_LESSON_ERROR]", error);
    return {
      course: null,
      lessons: null,
      currentLesson: null,
      nextLesson: null,
      userId: null,
      studentProfileId: null,
      progress: null,
      purchase: null,
    };
  }
}
