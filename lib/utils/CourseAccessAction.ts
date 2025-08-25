// @ts-nocheck
import axios from "axios";

export const checkCourseAccess = async (courseSlug, userId) => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/access`;

      try {
        const response = await axios.post(url, {
          courseSlug,
          userId,
        });
        return {
          access: response.data.access,
        };
      } catch (error) {
        console.error("Error checking course access via API", error);
        return {
          access: false,
          message:
            error.response?.data?.error || "Error occurred while checking access",
        };
      }
};