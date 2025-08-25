// @ts-nocheck

import { getProgress } from "@/actions/get-progress";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  try {
    const { courseId } = params;

    if (!courseId) {
      throw new Error("Failed to fetch the course. Missing courseId.");
    }
    const { isAdmin } = await getServerUserSession();

    if (!isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    // Fetch course details with related data
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        prices: true,
        lessons: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        coTeachers: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
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
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    // Check if userId is available
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if admin user
    const user = await db.user.findUnique({
      where: {
        id: userId,
        isAdmin: true,
      },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    // Fetch the course associated with the user (teacher)
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        attachments: true, // Include attachments to delete them
        lessons: true, // Include lessons to delete them
        enrolledStudents: true, // Include students
      },
    });

    if (!course) {
      // If course not found, return 404
      return new NextResponse("Course not found", { status: 404 });
    }

    if (course.enrolledStudents.length > 0) {
      // If students are enrolled, throw an error
      throw new Error("Cannot delete course with enrolled students.");
    } else {
      // Delete associated attachments
      if (course.attachments.length > 0) {
        await db.attachment.deleteMany({
          where: {
            courseId: params.courseId,
          },
        });
      }

      // Delete associated lessons and their videos
      if (course.lessons.length > 0) {
        for (const lesson of course.lessons) {
          const videoId = lesson.videoUrl; // Get the video URL from the lesson

          if (videoId) {
            // Construct the URL for deleting the video from VdoCipher
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

        // Delete the lessons after videos are deleted
        await db.lesson.deleteMany({
          where: {
            courseId: params.courseId,
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
    }
  } catch (error) {
    console.error(error.message);
    return new NextResponse(error.message, { status: 400 });
  }
}

export async function PATCH(
  req: Request,

  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    // Check if admin user

    const user = await db.user.findUnique({
      where: {
        id: userId,

        isAdmin: true,
      },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    // Parse the request body

    const values = await req.json();

    // Ensure at least one field is present to update

    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    // Find the existing course to ensure it exists and get current co-teachers

    const existingCourse = await db.course.findUnique({
      where: {
        id: courseId,
      },

      select: {
        id: true,

        coTeacherIds: true,
      },
    });

    // If the course is not found, return a 404 response

    if (!existingCourse) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Handle co-teacher assignment/unassignment if coTeacherIds is being updated

    if (values.coTeacherIds !== undefined) {
      const currentCoTeachers = existingCourse.coTeacherIds || [];

      const newCoTeachers = values.coTeacherIds || [];

      // Find teachers to add (in new list but not in current)

      const teachersToAdd = newCoTeachers.filter(
        (id: string) => !currentCoTeachers.includes(id)
      );

      // Find teachers to remove (in current list but not in new)

      const teachersToRemove = currentCoTeachers.filter(
        (id: string) => !newCoTeachers.includes(id)
      );

      // Add courseId to new co-teachers' coTeachingCourseIds

      for (const coTeacherId of teachersToAdd) {
        const existingProfile = await db.teacherProfile.findUnique({
          where: { id: coTeacherId },

          select: { coTeachingCourseIds: true },
        });

        if (existingProfile) {
          const updatedCourseIds = Array.from(
            new Set([...(existingProfile.coTeachingCourseIds || []), courseId])
          );

          await db.teacherProfile.update({
            where: { id: coTeacherId },

            data: {
              coTeachingCourseIds: updatedCourseIds,
            },
          });
        }
      }

      // Remove courseId from removed co-teachers' coTeachingCourseIds

      for (const coTeacherId of teachersToRemove) {
        const existingProfile = await db.teacherProfile.findUnique({
          where: { id: coTeacherId },

          select: { coTeachingCourseIds: true },
        });

        if (existingProfile) {
          const updatedCourseIds = (
            existingProfile.coTeachingCourseIds || []
          ).filter((id: string) => id !== courseId);

          await db.teacherProfile.update({
            where: { id: coTeacherId },

            data: {
              coTeachingCourseIds: updatedCourseIds,
            },
          });
        }
      }
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
