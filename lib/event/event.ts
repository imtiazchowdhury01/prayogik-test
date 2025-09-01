// lib/event/event.ts
import axios from "axios";

export interface EventFormData {
  title: string;
  slug: string;
  description?: string;
  date: string; // ISO string
  isOnline: boolean;
  location?: string;
  zoomLink?: string;
  imageUrl?: string;
  isPublished?: boolean;
  speakerIds?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface EventResponse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  date: string;
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

export async function createEvent(
  eventData: EventFormData
): Promise<ApiResponse<EventResponse>> {
  try {
    const response = await axios.post("/api/admin/event", {
      ...eventData,
      // Ensure date is properly formatted
      date: new Date(eventData.date).toISOString(),
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

export async function updateEvent(
  eventId: string,
  eventData: Partial<EventFormData>
): Promise<ApiResponse<EventResponse>> {
  try {
    const updateData = { ...eventData };

    // Ensure date is properly formatted if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date).toISOString();
    }

    const response = await axios.put(`/api/admin/event/${eventId}`, updateData);

    return response.data;
  } catch (error: any) {
    console.error("Error updating event:", error);

    if (error.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      error: "Failed to update event",
      details: error.message || "Unknown error occurred",
    };
  }
}

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

// Helper function to format event data for form initialization
export function formatEventForForm(event: EventResponse): EventFormData & {
  id: string;
  isPublished: boolean;
  speakers?: Array<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }>;
} {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description || "",
    date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local input
    isOnline: event.isOnline,
    location: event.location || "",
    zoomLink: event.zoomLink || "",
    imageUrl: event.imageUrl || "",
    isPublished: event.isPublished,
    speakerIds: event.speakerIds,
    faqs: event.faqs || [],
    speakers:
      event.speakers?.map((speaker) => ({
        id: speaker.id,
        name: speaker.user.name,
        email: speaker.user.email,
        avatarUrl: speaker.user.avatarUrl,
      })) || [],
  };
}
