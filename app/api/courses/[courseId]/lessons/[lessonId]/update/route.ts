import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { useCourseByTeacherOrCoTeacher } from "@/hooks/useTeacherProfile";
import { isTeacher } from "@/lib/teacher";

async function updateCourseTotalDuration(courseId: string) {
  const lessons = await db.lesson.findMany({
    where: { courseId },
    select: { duration: true },
  });

  const totalDuration = lessons.reduce(
    (sum, lesson) => sum + (lesson.duration || 0),
    0
  );

  await db.course.update({
    where: { id: courseId },
    data: { totalDuration },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  const { courseId, lessonId } = params;

  try {
    const { videoUrl, duration } = await request.json(); // Capture duration from request body

    // Update the lesson in the database
    await db.lesson.update({
      where: { id: lessonId },
      data: {
        videoUrl,
        duration,
      },
    });

    // Update the total duration for the course
    await updateCourseTotalDuration(courseId);

    return NextResponse.json(
      { message: "Lesson updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Failed to update lesson." },
      { status: 500 }
    );
  }
}

// api to upload text lesson by teacher/admin
export async function PUT(req: Request) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);
    const { id, textContent, videoUrl } = await req.json();

    // Check if the user is authenticated
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // Validate input
    if (!id) {
      return NextResponse.json({ message: "ID is required." }, { status: 400 });
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // If not admin, check if user has permission to update this lesson
    if (!isAdmin) {
      // First, get the lesson to find its courseId
      const lesson = await db.lesson.findUnique({
        where: { id },
        select: { courseId: true },
      });

      if (!lesson) {
        return NextResponse.json(
          { message: "Lesson not found" },
          { status: 404 }
        );
      }

      // Check if user is owner or co-teacher of the course
      const courseOwner = await useCourseByTeacherOrCoTeacher(
        userId,
        lesson.courseId
      );

      if (!courseOwner) {
        return NextResponse.json(
          { message: "Unauthorized Access" },
          { status: 401 }
        );
      }
    }

    // Update the lesson in the database
    const updatedLesson = await db.lesson.update({
      where: { id },
      data: {
        textContent: textContent || null,
        // videoUrl: videoUrl || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedLesson, { status: 200 });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { message: "Error updating lesson." },
      { status: 500 }
    );
  }
}
