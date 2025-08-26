// @ts-nocheck
import { cookies } from "next/headers";

export const getLesson = async (
  courseSlug: string,
  lessonSlug: string,
  userId: string
) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/front/lessons/lesson`;

  try {
    // Get cookies once and reuse
    const cookieStore = cookies();
    const cookieString = cookieStore.toString();

    // Add validation to prevent random IDs
    if (!courseSlug || !lessonSlug || !userId) {
      return {
        error: true,
        message: "Missing required parameters",
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieString,
        // Add cache control to prevent stale data
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        courseSlug,
        lessonSlug,
        userId,
      }),
      // Add cache configuration
      // cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      error: false,
      data,
    };
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return {
      error: true,
      message: error.response?.data?.error || error.message,
    };
  }
};
