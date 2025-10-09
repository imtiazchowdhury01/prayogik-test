// @ts-nocheck
import { RegularCoursesResponse, SearchApiResponse } from "@/types/course";
import { clientApi } from "../client";

// API functions
export const clientSideFetchCourses = async (
  page: number,
  limit: number
): Promise<RegularCoursesResponse> => {
  const response = await clientApi.getCoursesQuery({
    query: {
      page,
      limit,
      sort: "desc",
      isUnderSubscription: true,
    },
  });

  if (response.status !== 200) {
    throw new Error("কোর্স লোড করতে ব্যর্থ হয়েছে");
  }

  return response.body;
};

export const clientSideSearchCourses = async (
  query: string,
  page: number = 1,
  limit: number
): Promise<SearchApiResponse> => {
  try {
    const response = await clientApi.searchCourses({
      query: {
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        published: "true",
        advanced: "true",
        isUnderSubscription: "true",
      },
    });

    if (response.status === 200) {
      return response.body;
    }

    if (response.status === 400 || response.status === 500) {
      throw new Error(response.body.error || "কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
    }

    throw new Error("কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
  } catch (error) {
    if (error instanceof Error && !error.message.includes("কোর্স")) {
      throw new Error("কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
    }
    throw error;
  }
};
