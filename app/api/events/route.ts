// api/events/route.ts
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { EventStatus, EventType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface EventFilters {
  status?: EventStatus;
  isPublished: boolean;
  title?: {
    contains: string;
    mode: "insensitive";
  };
  type?: EventType;
  isOnline?: boolean;
}

interface PaginationParams {
  page: number;
  limit: number;
  totalEvents: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

type EventWithDetails = Prisma.EventGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    description: true;
    price: true;
    date: true;
    isOnline: true;
    location: true;
    zoomLink: true;
    imageUrl: true;
    isPublished: true;
    mapLocation: true;
    type: true;
    status: true;
    faqs: true;
    speakers: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

interface EventsResponse {
  events: EventWithDetails[];
  pagination: PaginationParams;
}

interface ErrorResponse {
  error: boolean;
  message: string;
}

// ========== GET HANDLER ==========

export async function GET(
  request: NextRequest
): Promise<NextResponse<EventsResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "12", 10);
    const title = searchParams.get("title") || undefined;
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");
    const isOnlineParam = searchParams.get("isOnline");
    const sortParam = searchParams.get("sort");

    // Validate and sanitize inputs
    const validatedPage = Math.min(Math.max(pageParam, 1), 50);
    const validatedLimit = Math.min(Math.max(limitParam, 1), 50);
    const skip = (validatedPage - 1) * validatedLimit;

    // Validate type
    const type: EventType | undefined =
      typeParam && ["EOI", "PAID", "FREE"].includes(typeParam)
        ? (typeParam as EventType)
        : undefined;

    // Validate status
    const status: EventStatus | undefined =
      statusParam && ["DRAFT", "UPCOMING", "CLOSED"].includes(statusParam)
        ? (statusParam as EventStatus)
        : "UPCOMING";

    // Validate isOnline
    const isOnline: boolean | undefined =
      isOnlineParam !== null ? isOnlineParam === "true" : undefined;

    // Validate sort
    const sort: "asc" | "desc" = sortParam === "desc" ? "desc" : "asc";

    // Build where clause
    const whereClause: Prisma.EventWhereInput = {
      status,
      isPublished: true,
    };

    if (title) {
      whereClause.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    if (type) {
      whereClause.type = type;
    }

    if (isOnline !== undefined) {
      whereClause.isOnline = isOnline;
    }

    // Get total count for pagination
    const totalEvents = await db.event.count({
      where: whereClause,
    });

    // Fetch events with pagination and sorting
    const events = await db.event.findMany({
      where: whereClause,
      orderBy: {
        date: sort,
      },
      skip,
      take: validatedLimit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        price: true,
        date: true,
        isOnline: true,
        location: true,
        zoomLink: true,
        imageUrl: true,
        isPublished: true,
        mapLocation: true,
        type: true,
        status: true,
        faqs: true,
        speakers: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalPages = Math.ceil(totalEvents / validatedLimit);

    const response: EventsResponse = {
      events,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        totalEvents,
        totalPages,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET_EVENTS_ERROR]", error);
    return NextResponse.json(
      {
        error: true,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
