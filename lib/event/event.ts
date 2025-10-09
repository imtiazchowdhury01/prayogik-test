// lib/event/event.ts
import { revalidatePage } from "@/actions/revalidatePage";
import { CreateEventInput, UpdateEventInput } from "@/schemas/event-schema";
import axios from "axios";
import toast from "react-hot-toast";

export interface EventResponse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  date?: string | null;
  isOnline: boolean;
  location?: string;
  zoomLink?: string;
  imageUrl?: string;
  isPublished: boolean;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  speakerIds: string[];
  speakers?: Array<{
    id: string;
    user: {
      name: string;
      email: string;
      avatarUrl?: string;
    };
  }>;
  attendees?: Array<{
    id: string;
    userId: string;
    registeredAt: string;
    user?: {
      name: string;
      email: string;
      avatarUrl?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  count?: number;
}

interface UpdateEventOptions {
  eventId: string;
  values: UpdateEventInput;
  slug: string;
  toggleEdit?: () => void;
  setLoading: (loading: boolean) => void;
  router: any; // Next.js router
  successMessage?: string;
  api?: string;
}

export async function createEvent(eventData: { title: string; slug: string }) {
  try {
    const response = await axios.post("/api/admin/event", {
      ...eventData,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating event:", error);

    if (error.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      error: "Failed to create event",
      details: error.message || "Unknown error occurred",
    };
  }
}

export const updateEvent = async ({
  eventId,
  values,
  slug,
  toggleEdit,
  setLoading,
  router,
  successMessage,
  api,
}: UpdateEventOptions) => {
  const apiRoute = api || `/api/admin/event/${eventId}`;
  setLoading(true);

  try {
    // Ensure date is properly formatted if provided
    const updateData = { ...values };
    // if (updateData.date) {
    //   updateData.date = new Date(updateData.date).toISOString();
    // }
    // allow null to clear date
    if (updateData.date === "") {
      updateData.date = null as any;
    } else if (updateData.date) {
      updateData.date = new Date(updateData.date).toISOString();
    }

    await axios.put(apiRoute, updateData);
    toast.success(successMessage || "Event updated");

    // Revalidate relevant pages
    revalidatePage([
      { route: "/" },
      { route: "/home" },
      { route: "/events" },
      { route: "/events/" + slug },
      { route: "/admin/events" },
      { route: "/preview/events/" + slug },
    ]);

    if (toggleEdit) {
      toggleEdit();
    }
    router.refresh();
  } catch (error: any) {
    console.error("Error updating event:", error);

    // Handle specific error messages from API response
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};

export async function getEvent(
  eventId: string
): Promise<ApiResponse<EventResponse>> {
  try {
    const response = await axios.get(`/api/admin/event/${eventId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching event:", error);

    if (error.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      error: "Failed to fetch event",
      details: error.message || "Unknown error occurred",
    };
  }
}

export async function getEvents(params?: {
  isOnline?: boolean;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<ApiResponse<EventResponse[]>> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.isOnline !== undefined) {
      searchParams.append("isOnline", String(params.isOnline));
    }

    if (params?.isPublished !== undefined) {
      searchParams.append("isPublished", String(params.isPublished));
    }

    if (params?.limit) {
      searchParams.append("limit", String(params.limit));
    }

    if (params?.offset) {
      searchParams.append("offset", String(params.offset));
    }

    if (params?.search) {
      searchParams.append("search", params.search);
    }

    const response = await axios.get(
      `/api/admin/events?${searchParams.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching events:", error);

    if (error.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      error: "Failed to fetch events",
      details: error.message || "Unknown error occurred",
    };
  }
}

export async function deleteEvent(eventId: string): Promise<ApiResponse> {
  try {
    const response = await axios.delete(`/api/admin/event/${eventId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting event:", error);

    if (error.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      error: "Failed to delete event",
      details: error.message || "Unknown error occurred",
    };
  }
}
