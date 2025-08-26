import { NextRequest, NextResponse } from "next/server";
import { Urls } from "@/constants/urls";
import {
  createVdeocipherFolderByCourseId,
  vdocipherFolderSearchByCourseId,
} from "@/lib/utils/vdeocipher";
import axios from "axios";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

// Helper function to delete video from VdoCipher
async function deleteVideoFromVdoCipher(videoId: string): Promise<boolean> {
  try {
    const deleteUrl = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;
    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
      },
    });
    return deleteResponse.ok;
  } catch (error) {
    console.error(`Failed to delete video ${videoId}:`, error);
    return false;
  }
}

// Helper function to rollback database changes
async function rollbackDatabaseChanges(
  lessonId: string | null,
  courseId: string,
  videoId: string
) {
  if (!lessonId) return;

  try {
    await db.$transaction(async (prisma) => {
      // Remove lesson video reference
      await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          videoUrl: "",
          duration: 0,
          videoStatus: "PROCESSING",
        },
      });

      // Remove vdocipher upload record if it exists
      // await prisma.vdocipherUploads.deleteMany({
      //   where: {
      //     courseId: courseId,
      //     lessonId: lessonId,
      //     videoId: videoId,
      //   },
      // });
    });
    console.log(
      `Successfully rolled back database changes for lesson ${lessonId}`
    );
  } catch (error) {
    console.error(
      `Failed to rollback database changes for lesson ${lessonId}:`,
      error
    );
  }
}

// Handle upload initiation
async function handleInitiate(data: any) {
  const { videoTitle, courseId, lessonId, isReplacing, originalVideoId } = data;
  let videoId: string | null = null;
  let videoReplacementAttempted = false;

  try {
    // Step 1: Handle video replacement and get/create folder in parallel
    const [, folderId] = await Promise.all([
      // Handle video replacement
      (async () => {
        if (isReplacing && originalVideoId && originalVideoId.trim() !== "") {
          try {
            console.log(`Attempting to replace video: ${originalVideoId}`);
            videoReplacementAttempted = true;

            // Check if video exists
            const videoCheckResponse = await fetch(
              `${Urls.vdocipherDevUrl}/${originalVideoId}`,
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
                },
              }
            );

            if (videoCheckResponse.ok) {
              console.log(
                `Video ${originalVideoId} exists, proceeding with deletion`
              );
              const deleted = await deleteVideoFromVdoCipher(originalVideoId);
              if (deleted) {
                console.log(
                  `Successfully deleted old video: ${originalVideoId}`
                );
                // Add delay to ensure VdoCipher processes the deletion
                await new Promise((resolve) => setTimeout(resolve, 3000));
              }
            } else {
              console.warn(
                `Video ${originalVideoId} not found, skipping deletion`
              );
            }
          } catch (deleteError: any) {
            console.error(
              `Error during video deletion: ${deleteError?.message}`
            );
          }
        }
      })(),

      // Get or create folder
      (async () => {
        const folderFetchByCourseId = await vdocipherFolderSearchByCourseId(
          courseId
        );

        if (folderFetchByCourseId) {
          return folderFetchByCourseId;
        } else {
          const createFolderResponse = await createVdeocipherFolderByCourseId(
            courseId
          );
          if (!createFolderResponse) {
            throw new Error("Failed to create folder");
          }
          return createFolderResponse.id;
        }
      })(),
    ]);

    // Step 2: Get upload credentials from VdoCipher
    const credentialsOptions = {
      method: "PUT",
      url: `${Urls.vdocipherDevUrl}?title=${encodeURIComponent(
        videoTitle || "Untitled Video"
      )}&folderId=${folderId || "root"}`,
      headers: {
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
      },
      timeout: 10000,
    };

    const credentialsResponse = await axios(credentialsOptions);
    const uploadCreds = credentialsResponse.data.clientPayload;
    videoId = credentialsResponse.data.videoId;

    if (!uploadCreds) {
      throw new Error("Failed to get upload credentials");
    }

    // Step 3: Create initial database record if lessonId provided
    if (lessonId) {
      await db.$transaction(async (prisma) => {
        await prisma.lesson.update({
          where: { id: lessonId! },
          data: {
            videoUrl: videoId,
            duration: 0,
            videoStatus: "PROCESSING",
          },
        });

        // Create initial vdocipher upload record
        await prisma.vdocipherUploads.create({
          data: {
            courseId: courseId!,
            lessonId: lessonId!,
            videoId: videoId!,
            duration: 0,
          },
        });
      });
      console.log(
        `Created initial database record for lesson ${lessonId} with video ${videoId}`
      );
    }

    return {
      success: true,
      videoId,
      uploadCredentials: uploadCreds,
      replaced: videoReplacementAttempted,
    };
  } catch (error) {
    // Cleanup on error
    if (videoId) {
      await deleteVideoFromVdoCipher(videoId);
    }
    throw error;
  }
}

// Handle upload finalization
async function handleFinalize(data: any) {
  const { videoId, duration, courseId, lessonId } = data;

  try {
    // Update database with final video info
    if (lessonId) {
      await db.$transaction(async (prisma) => {
        // Update lesson with final video info and create vdocipher upload record
        const [lessonUpdate] = await Promise.all([
          prisma.lesson.update({
            where: { id: lessonId! },
            data: {
              videoUrl: videoId,
              duration: duration,
              videoStatus: "PROCESSING",
            },
          }),

          // Upsert vdocipher upload record (update if exists, create if not)
          // await prisma.vdocipherUploads.upsert({
          //   where: {
          //     courseId: courseId!,
          //     lessonId: lessonId!,
          //     videoId: videoId!,
          //   },
          //   update: {
          //     duration: duration,
          //     videoStatus: "PROCESSING",
          //     updatedAt: new Date(),
          //   },
          //   create: {
          //     courseId: courseId!,
          //     lessonId: lessonId!,
          //     videoId: videoId!,
          //     duration: duration,
          //     videoStatus: "PROCESSING",
          //     createdAt: new Date(),
          //     updatedAt: new Date(),
          //   },
          // }),
        ]);

        return { lessonUpdate };
      });

      console.log(
        `Successfully completed all database operations for video ${videoId}`
      );
    }

    return {
      success: true,
      message: "Video uploaded successfully",
      videoId,
      duration,
    };
  } catch (error) {
    // Cleanup on error
    await deleteVideoFromVdoCipher(videoId);
    if (lessonId) {
      await rollbackDatabaseChanges(lessonId, courseId, videoId);
    }
    throw error;
  }
}

// Handle cleanup
async function handleCleanup(data: any) {
  const {
    videoId,
    courseId,
    lessonId,
    uploadCredentialsObtained,
    clientUploadSuccessful,
  } = data;

  const cleanupPromises = [];

  // Clean up VdoCipher video if upload was successful or credentials were obtained
  if (videoId && (clientUploadSuccessful || uploadCredentialsObtained)) {
    cleanupPromises.push(
      deleteVideoFromVdoCipher(videoId).then((success) => {
        if (success) {
          console.log(`Successfully cleaned up orphaned video ${videoId}`);
        } else {
          console.error(`Failed to cleanup orphaned video ${videoId}`);
        }
      })
    );
  }

  // Clean up database record if it was created
  if (lessonId && videoId) {
    cleanupPromises.push(rollbackDatabaseChanges(lessonId, courseId, videoId));
  }

  // Execute cleanup operations
  if (cleanupPromises.length > 0) {
    await Promise.allSettled(cleanupPromises);
  }

  return { success: true, message: "Cleanup completed" };
}

export async function POST(request: any) {
  try {
    // Authentication
    const { role } = await getServerUserSession(request);
    if (role !== "ADMIN" && role !== "TEACHER") {
      console.log("Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request data
    const data = await request.json();
    const { action } = data;

    // Route to appropriate handler based on action
    let result;
    switch (action) {
      case "initiate":
        result = await handleInitiate(data);
        break;
      case "finalize":
        result = await handleFinalize(data);
        break;
      case "cleanup":
        result = await handleCleanup(data);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Operation failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  try {
    const apiSecret = process.env.VDOCIPHER_API_SECRET;

    const response = await fetch(`${Urls.vdocipherDevUrl}/${videoId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Apisecret ${apiSecret}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch video length" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ length: data.length });
  } catch (error) {
    console.error("Error fetching video length:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
