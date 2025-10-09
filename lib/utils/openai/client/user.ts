import { clientApi } from "@/lib/utils/openai/client";

export const clientSidefetchUserSubscription = async () => {
  try {
    const response = await clientApi.getUserSubscriptions({});
    return response?.body ?? null;
  } catch (error) {
    console.error("Failed to fetch user subscription:", error);
    return null;
  }
};

// Fetch functions for React Query
export const clientFetchPurchasedCourses = async ({ pageParam = 0 }) => {
  const response = await clientApi.getDashboardCourses({
    query: {
      tab: "purchased",
      page: pageParam.toString(),
      limit: "10",
    },
  });
  if (response.status === 200) {
    return response.body;
  }
  throw new Error("Failed to fetch purchased courses");
};

export const clientFetchSubscriptionCourses = async ({ pageParam = 0 }) => {
  // console.log('Fetching subscription courses with pageParam:', pageParam);
  const response = await clientApi.getDashboardCourses({
    query: {
      tab: "subscription",
      limit: "10",
      page: pageParam.toString(),
    },
  });
  if (response.status === 200) {
    // console.log('Subscription courses response:', response.body);
    return response.body;
  }
  throw new Error("Failed to fetch subscription courses");
};

export const clientFetchDashboardMetadata = async () => {
  const response = await clientApi.getDashboardCourses({
    query: {
      metadataOnly: "true",
    },
  });
  if (response.status === 200) {
    return response.body;
  }
  throw new Error("Failed to fetch dashboard metadata");
};

export const clientFetchCertificateCourses = async ({ pageParam = 0 }) => {
  // console.log('Fetching certificate courses with pageParam:', pageParam);
  const response = await clientApi.getDashboardCourses({
    query: {
      tab: "certificate",
      page: pageParam.toString(),
      limit: "10",
    },
  });
  if (response.status === 200) {
    // console.log('Certificate courses response:', response.body);
    return response.body;
  }
  throw new Error("Failed to fetch certificate courses");
};

export const clientFetchRegisteredEvents = async (
  userId: string,
  { pageParam = 0 }
) => {
  // console.log('Fetching registered events with pageParam:', pageParam);
  const response = await clientApi.getDashboardCourses({
    query: {
      tab: "event",
      page: pageParam.toString(),
      limit: "10",
    },
  });
  if (response.status === 200) {
    // console.log('Registered events response:', response.body);
    return response.body;
  }
  throw new Error("Failed to fetch registered events");
};

export const clientFetchUserDetails = async () => {
  const response = await clientApi.getUserDetails();
  if (response.status === 200) {
    return response.body;
  }

  throw new Error("Failed to fetch user details");
};
