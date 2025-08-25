import { useStudentProfile } from "./../../../../hooks/useStudentProfile";

import { getProgress } from "@/actions/get-progress";
import { deleteImageFromS3 } from "@/actions/upload-aws";
import {
  useCoTeacherProfileId,
  useCourseByTeacherOrCoTeacher,
  useTeacherProfile,
} from "@/hooks/useTeacherProfile";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { RouteHandler } from "@/lib/utils/server/route-handler";
import { deleteFolderInVdeocipherByCourseId } from "@/lib/utils/vdeocipher";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

export async function GET(req: any, { params }: any) {
  try {
    const { courseId } = params;
    if (!courseId) {
      throw new Error("Failed to fetch the course. Missing courseId.");
    }
    const { userId } = await getServerUserSession();

    if (!userId) {
      throw new Error("User not found");
    }

    const studentProfileId = await useStudentProfile(userId);

    // Fetch course details with related data
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        // subscriptionDiscount: true,
        purchases: userId
          ? {
              where: {
                studentProfileId,
              },
            }
          : false,
        lessons: {
          where: {
            isPublished: true,
          },
          include: userId
            ? {
                Progress: {
                  where: {
                    studentProfileId,
                  },
                },
              }
            : null,
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
    });
    return NextResponse.json(course);
  } catch (error: any) {
    // console.log("SINGLE_COURSE_ERROR:", error);
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

    const teacherProfileId = await useTeacherProfile(userId);

    // Fetch the course associated with the user (teacher)
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherProfileId, // Ensure that the user (teacher) owns the course
      },
      include: {
        // subscriptionDiscount: true,
        attachments: true, // Include attachments to delete them
        lessons: true, // Include lessons to delete them
        enrolledStudents: true, // Include students
      },
    });

    if (!course) {
      // If course not found, return 404
      return new NextResponse("Course not found", { status: 404 });
    }
    // Check if any lessons contain video URLs
    const lessonsWithVideos = course.lessons.filter(
      (lesson) => lesson.videoUrl
    );

    if (course.enrolledStudents.length > 0 || lessonsWithVideos.length > 0) {
      let errorMessage = "";

      if (course.enrolledStudents.length > 0) {
        errorMessage = "Cannot delete course with enrolled students.";
      }

      if (lessonsWithVideos.length > 0) {
        if (errorMessage) errorMessage += " ";
        errorMessage +=
          "Please delete all lessons with videos first before deleting the course.";
      }

      // Throw a regular error (can be caught in a try/catch or show toast on client)
      throw new Error(errorMessage);
    } else {
      // Delete course image from S3 and clear imageUrl in database
      if (course.imageUrl) {
        try {
          const imageKey = course.imageUrl.split(".amazonaws.com/")[1];
          if (imageKey) {
            await deleteImageFromS3(imageKey);
          }
          // Remove imageUrl from the course record before deletion
          await db.course.update({
            where: { id: params.courseId },
            data: { imageUrl: "" },
          });
        } catch (error) {
          console.error("Failed to delete course image:", error);
        }
      }
      // Delete associated attachments
      if (course.attachments.length > 0) {
        // First delete all attachments from S3
        for (const attachment of course.attachments) {
          try {
            const previousKey = attachment.url?.split(".amazonaws.com/")[1];
            console.log("previousKey result:", previousKey);
            if (previousKey) {
              await deleteImageFromS3(previousKey);
            }
          } catch (error) {
            console.error(
              `Failed to delete attachment from S3: ${attachment.id}`,
              error
            );
          }
        }

        // Then delete all attachments from database
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

      // Delete folder in vdeocipher
      await deleteFolderInVdeocipherByCourseId(params.courseId);

      // Delete the course
      const deletedCourse = await db.course.delete({
        where: {
          id: params.courseId,
        },
      });

      // Return the deleted course data in response
      return NextResponse.json(deletedCourse);
    }
  } catch (error: any) {
    console.error(error.message);
    return new NextResponse(error.message, { status: 400 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { userId } = await request.json(); // Extract userId from request body
  const { courseId } = params; // Extract courseId from route parameters

  try {
    // Fetch the progress using the getProgress function
    const progressPercentage = await getProgress(userId, courseId);

    // Return the progress percentage as a JSON response
    return NextResponse.json({ progress: progressPercentage });
  } catch (error) {
    console.error(error);
    // Return an error response
    return NextResponse.json(
      { error: "Error fetching progress" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);
    const { courseId } = params;

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

    const teacherProfileId = await useTeacherProfile(userId);
    const coTeacherProfileId = await useCoTeacherProfileId(
      userId,
      params.courseId
    );

    if (!isAdmin && !teacherProfileId && !coTeacherProfileId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Build where clause based on role
    let whereClause: any = {
      id: courseId,
    };

    // If user is not admin, add teacher/co-teacher restrictions
    if (!isAdmin) {
      whereClause.OR = [];

      if (teacherProfileId) {
        whereClause.OR.push({ teacherProfileId });
      }

      if (coTeacherProfileId) {
        whereClause.OR.push({
          coTeacherIds: {
            hasSome: [coTeacherProfileId],
          },
        });
      }
    }

    const existingCourse = await db.course.findUnique({
      where: whereClause,
      include: {
        lessons: true,
        category: true,
        attachments: true,
      },
    });

    // If the course is not found, return a 404 response
    if (!existingCourse) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Get current coTeacherIds from the existing course
    const currentCoTeachers = existingCourse.coTeacherIds || [];

    // Handle co-teacher assignment/unassignment if coTeacherIds is being updated
    if (values.coTeacherIds !== undefined) {
      const newCoTeachers = values.coTeacherIds || [];

      // Handle empty array case explicitly
      if (newCoTeachers.length === 0) {
        // If empty array is sent, remove courseId from all current co-teachers
        if (currentCoTeachers.length > 0) {
          console.log(`Removing all co-teachers from course ${courseId}`);

          for (const coTeacherId of currentCoTeachers) {
            try {
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
            } catch (error) {
              console.error(
                `Error removing courseId from teacher ${coTeacherId}:`,
                error
              );
            }
          }
        }
      } else {
        // Handle non-empty array case
        // Find teachers to add (in new list but not in current)
        const teachersToAdd = newCoTeachers.filter(
          (id: string) => !currentCoTeachers.includes(id)
        );

        // Find teachers to remove (in current list but not in new)
        const teachersToRemove = currentCoTeachers.filter(
          (id: string) => !newCoTeachers.includes(id)
        );

        // Add courseId to new co-teachers' coTeachingCourseIds
        if (teachersToAdd.length > 0) {
          // console.log(
          //   `Adding co-teachers to course ${courseId}:`,
          //   teachersToAdd
          // );

          for (const coTeacherId of teachersToAdd) {
            try {
              const existingProfile = await db.teacherProfile.findUnique({
                where: { id: coTeacherId },
                select: { coTeachingCourseIds: true },
              });

              if (existingProfile) {
                const updatedCourseIds = Array.from(
                  new Set([
                    ...(existingProfile.coTeachingCourseIds || []),
                    courseId,
                  ])
                );

                await db.teacherProfile.update({
                  where: { id: coTeacherId },
                  data: {
                    coTeachingCourseIds: updatedCourseIds,
                  },
                });
              }
            } catch (error) {
              console.error(
                `Error adding courseId to teacher ${coTeacherId}:`,
                error
              );
            }
          }
        }

        // Remove courseId from removed co-teachers' coTeachingCourseIds
        if (teachersToRemove.length > 0) {
          console.log(
            `Removing co-teachers from course ${courseId}:`,
            teachersToRemove
          );

          for (const coTeacherId of teachersToRemove) {
            try {
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
            } catch (error) {
              console.error(
                `Error removing courseId from teacher ${coTeacherId}:`,
                error
              );
            }
          }
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
