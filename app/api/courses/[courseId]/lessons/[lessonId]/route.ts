//@ts-nocheck
import {
  useCoTeacherProfileId,
  useCourseByTeacherOrCoTeacher,
  useTeacherProfile,
} from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";
import updateCourseDuration from "@/lib/utils/updateCourseDuration";
import { duration } from "moment";
import { NextResponse } from "next/server";

// Get
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    // Ensure user session is retrieved
    const { userId, isAdmin } = await getServerUserSession(req);

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse(
        { error: "Unauthorized access. Please log in." },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const teacherProfile = await db.teacherProfile.findUnique({
      where: {
        userId: userId, // Getting the teacher profile using userId
      },
    });
    let teacherProfileId = teacherProfile?.id;
    const coTeacherProfileId = await useCoTeacherProfileId(
      userId,
      params.courseId
    );

    // Ensure user is authenticated (allow if admin, teacher, or co-teacher)
    if (!isAdmin && !teacherProfileId && !coTeacherProfileId) {
      return new NextResponse(
        { error: "Unauthorized access." },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the course belongs to the user (skip this check for admins)
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      // If the user does not own the course
      if (!ownCourse) {
        return new NextResponse(
          { error: "Unauthorized access. You do not own this course." },
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Retrieve the specific lesson data
    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        courseId: params.courseId, // Ensure the lesson belongs to the correct course
      },
    });

    // If the lesson does not exist
    if (!lesson) {
      return new NextResponse(
        { error: "lesson not found." },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the found lesson as a JSON response
    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[GET_lesson_ERROR]", error);
    return new NextResponse(
      { error: "Internal Server Error. Please try again later." },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    const teacherProfile = await db.teacherProfile.findUnique({
      where: {
        userId: userId, // Getting the teacher profile using userId
      },
    });
    let teacherProfileId = teacherProfile?.id;
    const coTeacherProfileId = await useCoTeacherProfileId(
      userId,
      params.courseId
    );

    // Ensure user is authenticated (allow if admin, teacher, or co-teacher)
    if (!isAdmin && !teacherProfileId && !coTeacherProfileId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the incoming request body
    const { videoUrl, duration, ...values } = await req.json();

    // Validate video URL if provided
    if (videoUrl && typeof videoUrl !== "string") {
      return new NextResponse("Invalid video URL", { status: 400 });
    }

    // Check if the course belongs to the user (skip this check for admins)
    if (!isAdmin) {
      const ownCourse = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    // Fetch the existing lesson to preserve current values
    const existingLesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        courseId: params.courseId,
      },
    });

    if (!existingLesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    // Existing slug check
    if (values?.slug) {
      const lessonWithSameSlug = await db.lesson.findFirst({
        where: {
          slug: values?.slug,
          courseId: params.courseId,
        },
      });

      if (lessonWithSameSlug) {
        return new NextResponse("Slug already exists", { status: 403 });
      }
    }

    // Update the lesson with new values
    const updatedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        courseId: params.courseId, // Ensure the lesson belongs to the correct course
      },
      data: {
        ...values,
        videoUrl: videoUrl ?? existingLesson.videoUrl, // Use the existing value if videoUrl is not provided
        duration: duration ?? existingLesson.duration, // Update duration
      },
    });

    // check if all the required fields are filled
    const requiredFields = [
      updatedLesson.title,
      updatedLesson.videoUrl || updatedLesson.textContent,
    ];
    // check true or false
    const isComplete = requiredFields.every(Boolean);

    // if false then unpublish the lesson
    if (!isComplete && updatedLesson.isPublished) {
      await db.lesson.update({
        where: {
          id: params.lessonId,
          courseId: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    // await updateCourseTotalDuration(params.courseId);
    // update total duration of the course by using the helper function
    await updateCourseDuration(params.courseId);

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error("[COURSES_LESSON_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// async function updateCourseTotalDuration(courseId: string) {
//   const lessons = await db.lesson.findMany({
//     where: { courseId },
//     select: { duration: true },
//   });

//   const totalDuration = lessons.reduce(
//     (sum, lesson) => sum + (lesson.duration || 0),
//     0
//   );

//   await db.course.update({
//     where: { id: courseId },
//     data: { totalDuration },
//   });
// }

// Delete
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If not admin, check if user has permission to delete this lesson
    if (!isAdmin) {
      const teacherProfileId = await useTeacherProfile(userId);
      const coTeacherProfileId = await useCoTeacherProfileId(
        userId,
        params.courseId
      );

      if (!teacherProfileId && !coTeacherProfileId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      // Check if the user owns the course
      const ownCourse = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    // Find the chapter to delete
    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        courseId: params.courseId,
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson Not Found", { status: 404 });
    }

    const videoId = lesson.videoUrl; // Get the video ID from the chapter
    if (videoId) {
      // Construct the URL for deleting the video
      const apiSecret = process.env.VDOCIPHER_API_SECRET;
      if (!apiSecret) {
        throw new Error("API Secret is not defined.");
      }

      const url = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;

      // Attempt to delete the video from VdoCipher
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${apiSecret}`,
          },
        });

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Response from VdoCipher: ${errorText}`);
          throw new Error(
            `Failed to delete video ${videoId}: ${response.status} - ${errorText}`
          );
        }

        // Get the response data
        const data = await response.json();
      } catch (videoError) {
        const videoErrorMessage =
          videoError instanceof Error ? videoError.message : "Unknown error";
        console.error(
          `Failed to delete video ${videoId} from VdoCipher`,
          videoErrorMessage
        );
        return new NextResponse(
          `Failed to delete video from VdoCipher: ${videoErrorMessage}`,
          { status: 500 }
        );
      }
    }

    // Delete any user progress associated with the chapter
    await db.progress.deleteMany({
      where: {
        lessonId: lesson.id,
      },
    });

    // Delete the chapter
    const deletedLesson = await db.lesson.delete({
      where: {
        id: params.lessonId,
      },
    });

    // Check if there are any other published chapters in the course
    const remainingPublishedLessons = await db.lesson.count({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    // If no published chapters remain, mark the course as unpublished
    if (remainingPublishedLessons === 0) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    // update total duration of the course by using the helper function
    await updateCourseDuration(params.courseId);

    return NextResponse.json(deletedLesson);
  } catch (error) {
    console.error("[LESSON_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
