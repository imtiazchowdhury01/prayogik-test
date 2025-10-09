// @ts-nocheck

import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    // Check if userId is available
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherProfileId = await useTeacherProfile(userId);

    // Fetch the course associated with the user (teacher)
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId,
      },
      include: {
        attachments: true, // Include attachments to delete them
        chapters: true, // Include chapters to delete them
      },
    });

    // If course not found, return 404
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Delete associated attachments
    if (course.attachments.length > 0) {
      await db.attachment.deleteMany({
        where: {
          courseId: params.courseId,
        },
      });
    }

    // Delete associated chapters and their videos
    if (course.chapters.length > 0) {
      for (const chapter of course.chapters) {
        const videoId = chapter.videoUrl; // Get the video ID from the chapter
        if (videoId) {
          // Construct the URL for deleting the video
          const apiSecret = process.env.VDOCIPHER_API_SECRET;
          if (!apiSecret) {
            throw new Error("API Secret is not defined.");
          }

          const url = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;

          // Attempt to delete the video from VdoCipher
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
        }
      }

      // Delete the chapters after videos are deleted
      await db.lesson.deleteMany({
        where: {
          id: params.courseId,
        },
      });
    }

    // Delete the course
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    // Return the deleted course data in response
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[COURSE_ID_DELETE]", error); // Use console.error for error logging
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);
    const { courseId } = params;

    const teacherProfileId = await useTeacherProfile(userId);

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

    // Find the existing course to ensure it belongs to the user
    const existingCourse = await db.course.findUnique({
      where: {
        id: courseId,
        teacherProfileId,
      },
    });

    // If the course is not found, return a 404 response
    if (!existingCourse) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the course with the provided fields
    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values, // Only apply the fields being updated
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSE_ID_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
