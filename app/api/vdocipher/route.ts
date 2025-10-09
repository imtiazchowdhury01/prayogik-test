// api/vdocipher/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Urls } from "@/constants/urls";
import {
  createVdeocipherFolderByCourseId,
  vdocipherFolderSearchByCourseId,
} from "@/lib/utils/vdeocipher";
import axios from "axios";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

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

async function rollbackDatabaseChanges(
  lessonId: string | null,
  courseId: string,
  videoId: string
) {
  if (!lessonId) return;

  try {
    await db.$transaction(async (prisma) => {
      await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          videoUrl: "",
          duration: 0,
          videoStatus: "PROCESSING",
        },
      });
    });
  } catch (error) {
    console.error(
      `Failed to rollback database changes for lesson ${lessonId}:`,
      error
    );
  }
}

async function handleInitiate(data: any) {
  const { videoTitle, courseId, lessonId, isReplacing, originalVideoId } = data;
  let videoId: string | null = null;
  let videoReplacementAttempted = false;

  try {
    const [, folderId] = await Promise.all([
      (async () => {
        if (isReplacing && originalVideoId && originalVideoId.trim() !== "") {
          try {
            videoReplacementAttempted = true;

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
              const deleted = await deleteVideoFromVdoCipher(originalVideoId);
              if (deleted) {
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

    if (lessonId && videoId) {
      await db.$transaction(async (prisma) => {
        await prisma.lesson.update({
          where: { id: lessonId },
          data: {
            videoUrl: videoId,
            duration: 0,
            videoStatus: "PROCESSING",
          },
        });

        await prisma.vdocipherUploads.create({
          data: {
            courseId: courseId,
            lessonId: lessonId,
            videoId: videoId,
            duration: 0,
          },
        });
      });
    }

    return {
      success: true,
      videoId,
      uploadCredentials: uploadCreds,
      replaced: videoReplacementAttempted,
    };
  } catch (error) {
    if (videoId) {
      await deleteVideoFromVdoCipher(videoId);
    }
    throw error;
  }
}

async function handleFinalize(data: any) {
  const { videoId, duration, courseId, lessonId } = data;

  try {
    if (lessonId) {
      await db.$transaction(async (prisma) => {
        await prisma.lesson.update({
          where: { id: lessonId },
          data: {
            videoUrl: videoId,
            duration: duration,
            videoStatus: "PROCESSING",
          },
        });
      });
    }

    return {
      success: true,
      message: "Video uploaded successfully",
      videoId,
      duration,
    };
  } catch (error) {
    await deleteVideoFromVdoCipher(videoId);
    if (lessonId) {
      await rollbackDatabaseChanges(lessonId, courseId, videoId);
    }
    throw error;
  }
}

async function handleCleanup(data: any) {
  const {
    videoId,
    courseId,
    lessonId,
    uploadCredentialsObtained,
    clientUploadSuccessful,
  } = data;

  const cleanupPromises = [];

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

  if (lessonId && videoId) {
    cleanupPromises.push(rollbackDatabaseChanges(lessonId, courseId, videoId));
  }

  if (cleanupPromises.length > 0) {
    await Promise.allSettled(cleanupPromises);
  }

  return { success: true, message: "Cleanup completed" };
}

export async function POST(request: NextRequest) {
  try {
    const { role } = await getServerUserSession();
    if (role !== "ADMIN" && role !== "TEACHER") {
      console.log("Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { action } = data;

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
