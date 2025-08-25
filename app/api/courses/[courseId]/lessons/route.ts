// @ts-nocheck

import {
  useCoTeacherProfileId,
  useCourseByTeacherOrCoTeacher,
  useTeacherProfile,
} from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
// import { compositeSlugify } from "@/lib/slugify";
import { isTeacher } from "@/lib/teacher";
import { NextResponse } from "next/server";

// CREATE a new lesson
export async function POST(req, { params }) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req); // Fetch the user ID and admin status from session

    if (!userId) {
      throw new Error("Unauthorized Access");
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      throw new Error("Unauthorized Access");
    }

    const teacherProfile = await db.teacherProfile.findUnique({
      where: {
        userId: userId, // Getting the teacher profile using userId
      },
    });
    let teachersProfileId = teacherProfile?.id;

    // If not admin, ensure that the user is the owner of the course or co-teacher
    if (!isAdmin) {
      const courseOwner = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      if (!courseOwner) {
        throw new Error("Unauthorized Access");
      }
    }

    // Fetch the last lesson to determine the position for the new lesson
    const lastLesson = await db.lesson.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    const { title, slug } = await req.json();

    // Ensure the slug is unique
    const lessonWithSameSlug = await db.lesson.findFirst({
      where: {
        courseId: params.courseId,
        slug,
      },
    });

    if (lessonWithSameSlug) {
      return new NextResponse("Slug already exists", { status: 401 });
    }

    // Create a new lesson
    const lesson = await db.lesson.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
        slug,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.log("[LESSONS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// READ all lessons for a course
export async function GET(req, { params }) {
  try {
    const lessons = await db.lesson.findMany({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.log("[LESSONS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// UPDATE a lesson
export async function PATCH(req, { params }) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req); // Fetch the user ID and admin status from session

    if (!userId) {
      throw new Error("Unauthorized Access");
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      throw new Error("Unauthorized Access");
    }

    const teacherProfileId = await useTeacherProfile(userId);

    // If not admin, ensure that the user is the owner of the course or co-teacher
    if (!isAdmin) {
      const courseOwner = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      if (!courseOwner) {
        throw new Error("Unauthorized Access");
      }
    }

    const { title, slug } = await req.json();

    // Update the lesson
    const updatedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
      },
      data: {
        title,
        slug,
      },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.log("[LESSONS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE a lesson
export async function DELETE(req, { params }) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req); // Fetch the user ID and admin status from session

    if (!userId) {
      throw new Error("Unauthorized Access");
    }

    // Check if user is admin or teacher
    if (!isAdmin && !isTeacher(userId)) {
      throw new Error("Unauthorized Access");
    }

    const teacherProfileId = await useTeacherProfile(userId);

    // If not admin, ensure that the user is the owner of the course or co-teacher
    if (!isAdmin) {
      const courseOwner = await useCourseByTeacherOrCoTeacher(
        userId,
        params.courseId
      );

      if (!courseOwner) {
        throw new Error("Unauthorized Access");
      }
    }

    // Delete the lesson
    await db.lesson.delete({
      where: {
        id: params.lessonId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[LESSONS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
