// app/api/admin/events/route.ts
import { db } from "@/lib/db";
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
    const body = await request.json();

    // Validate required fields
    const { title, slug, date, isOnline, type } = body;

    if (!title || !slug || !date || !type || typeof isOnline !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: "title, slug, date, and isOnline are required",
        },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingEvent = await db.event.findUnique({
      where: { slug: body.slug },
    });

    if (existingEvent) {
      return NextResponse.json(
        {
          success: false,
          error: "Event slug already exists",
          details: "slug already exists",
        },
        { status: 409 }
      );
    }

    // Validate date format
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid date format",
        },
        { status: 400 }
      );
    }

    // Validate location requirements based on event type
    if (!isOnline && !body.location) {
      return NextResponse.json(
        {
          success: false,
          error: "Offline events must have a location",
        },
        { status: 400 }
      );
    }

    // Validate zoom link if provided for online events
    if (isOnline && body.zoomLink) {
      try {
        new URL(body.zoomLink);
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid zoom link URL format",
          },
          { status: 400 }
        );
      }
    }

    // Process and validate speakers array
    let processedSpeakers = [];
    if (body.speakers && Array.isArray(body.speakers)) {
      processedSpeakers = body.speakers
        .filter(
          (speaker: any) =>
            speaker.name &&
            speaker.name.trim() &&
            speaker.avatarUrl &&
            typeof speaker.name === "string" &&
            typeof speaker.avatarUrl === "string"
        )
        .map((speaker: any) => ({
          name: speaker.name.trim(),
          designation: speaker.designation ? speaker.designation.trim() : null,
          avatarUrl: speaker.avatarUrl,
        }));
    }

    // Process and validate FAQs array
    let processedFaqs = [];
    if (body.faqs && Array.isArray(body.faqs)) {
      processedFaqs = body.faqs
        .filter(
          (faq: any) =>
            faq.question &&
            faq.answer &&
            faq.question.trim() &&
            faq.answer.trim() &&
            typeof faq.question === "string" &&
            typeof faq.answer === "string"
        )
        .map((faq: any) => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }));
    }

    // Create the event
    const event = await db.event.create({
      data: {
        title: body.title.trim(),
        slug: body.slug.trim(),
        description: body.description ? body.description.trim() : null,
        date: eventDate,
        type: body.type,
        isOnline: body.isOnline,
        location: body.location ? body.location.trim() : null,
        zoomLink: body.zoomLink ? body.zoomLink.trim() : null,
        imageUrl: body.imageUrl ? body.imageUrl.trim() : null,
        mapLocation: body.mapLocation ? body.mapLocation.trim() : null,
        isPublished: body.isPublished || false,
        speakers: processedSpeakers,
        faqs: processedFaqs,
      },
      include: {
        attendees: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Event slug already exists",
          details: "slug already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
