// app/api/admin/events/route.ts
import { db } from "@/lib/db";
import {
  checkSlugUniqueness,
  createEventErrorResponse,
  createEventSuccessResponse,
  processEventData,
} from "@/lib/utils/event/event-api-response";
import { CreateEventSchema } from "@/schemas/event-schema";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/events - Get all events with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isOnline = searchParams.get("isOnline");
    const isPublished = searchParams.get("isPublished");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const search = searchParams.get("search");

    const where: any = {};

    if (isOnline !== null && isOnline !== "") {
      where.isOnline = isOnline === "true";
    }

    if (isPublished !== null && isPublished !== "") {
      where.isPublished = isPublished === "true";
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const events = await db.event.findMany({
      where,
      include: {
        attendees: true,
      },
      orderBy: {
        date: "asc",
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch events",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const { title, slug } = await request.json();

  
    if (!slug || !title) {
      return createEventErrorResponse("Title and Slug are required", 400);
    }

    // check if any event with same slug exists
    const isSlugUnique = await checkSlugUniqueness(slug);
    if (!isSlugUnique) {
      return createEventErrorResponse("Event slug already exists", 409);
    }

    //  create event
    const event = await db.event.create({
      data: {
        title,
        slug,
      },
    });
    return createEventSuccessResponse(event, 201);
  } catch (error) {
    console.error("Error creating event:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return createEventErrorResponse(
          "Event slug already exists",
          409,
          "Please choose a different slug"
        );
      }
    }

    return createEventErrorResponse(
      "Failed to create event",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
