import { Urls } from "@/constants/urls";
import axios from "axios";

export async function deleteVideo(
  videoId: string,
  courseId: string,
  lessonId: string,
  options: any = {}
): Promise<any> {
  try {
    // Validate videoId
    if (!videoId || typeof videoId !== "string" || videoId.trim() === "") {
      return {
        success: false,
        error: "Invalid video ID provided",
      };
    }

    const { timeout = 30000, baseUrl = "" } = options;
    const url = `${baseUrl}/api/vdocipher/${videoId.trim()}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error:
            responseData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      // Update database first
      const { data: lessonResponse } = await axios.patch(
        `/api/courses/${courseId}/lessons/${lessonId}`,
        {
          videoUrl: "",
          duration: 0,
          videoStatus: "PROCESSING",
        }
      );

      // console.log("API update after new video upload:", lessonResponse);

      return {
        success: true,
        data: responseData,
        lessonResponse,
      };
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout - video deletion took too long",
        };
      }

      throw fetchError;
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Failed to delete video ${videoId}:`, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export const vdocipherFolderSearchByCourseId = async (courseId: string) => {
  try {
    const response = await fetch(`${Urls.vdocipherDevUrl}/folders/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
      },
      body: JSON.stringify({
        name: courseId,
      }),
    });

    const data = await response.json();
    return data?.folders[0]?.id; // Return folderId of vdeoCipher
  } catch (error) {
    console.error("Error fetching folder:", error);
    return null;
  }
};

export const createVdeocipherFolderByCourseId = async (courseId: string) => {
  try {
    const response = await fetch(`${Urls.vdocipherDevUrl}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
      },
      body: JSON.stringify({
        name: courseId,
        parent: "root",
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating folder:", error);
    return null;
  }
};

export const uploadVideoByLessonAndFolder = async (
  lessonId: string,
  folderId: string
) => {
  try {
    const options = {
      method: "PUT",
      url: `${Urls.vdocipherDevUrl}?title=${encodeURIComponent(
        lessonId || "Untitled Video"
      )}&folderId=${folderId || "root"}`,
      headers: {
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
      },
      timeout: 5000, // Set a timeout for the request
    };

    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    return null;
  }
};

export const deleteFolderInVdeocipherByCourseId = async (courseId: string) => {
  try {
    const folderId = await vdocipherFolderSearchByCourseId(courseId);

    if (!folderId) {
      throw new Error("Folder not found!");
    }

    const options = {
      method: "DELETE",
      url: `${Urls.vdocipherDevUrl}/folders/${folderId}`,
      headers: {
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
      },
      timeout: 5000, // Set a timeout for the request
    };

    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error("Error deleting folder in vdeocipher:", error);
    return null;
  }
};
