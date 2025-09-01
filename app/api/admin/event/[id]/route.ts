// app/api/admin/events/[id]/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
  };
}
// GET /api/events/[id] - Get a single event by ID
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    const event = await db.event.findUnique({
      where: { id },
      include: {
        attendees: {
          // Include relevant fields from EventRegistration
          select: {
            id: true,
            // Add other fields you want to include
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/events/[id] - Update an event
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if event exists
    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 }
      );
    }

    // Check slug uniqueness if slug is being updated
    if (body.slug && body.slug !== existingEvent.slug) {
      const slugExists = await db.event.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: "Event slug already exists",
            details: "slug already exists",
          },
          { status: 409 }
        );
      }
    }

    // Validate date if provided
    if (body.date) {
      const eventDate = new Date(body.date);
      if (isNaN(eventDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid date format",
          },
          { status: 400 }
        );
      }
      body.date = eventDate;
    }

    // Validate online/offline constraints
    const isOnline =
      body.isOnline !== undefined ? body.isOnline : existingEvent.isOnline;
    const location =
      body.location !== undefined ? body.location : existingEvent.location;
    const zoomLink =
      body.zoomLink !== undefined ? body.zoomLink : existingEvent.zoomLink;

    if (!isOnline && !location) {
      return NextResponse.json(
        {
          success: false,
          error: "Offline events must have a location",
        },
        { status: 400 }
      );
    }

    // Validate zoom link URL format if provided
    if (body.zoomLink) {
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

    // Prepare update data object
    const updateData: any = {};

    // Only add fields that are provided in the request body
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.slug !== undefined) updateData.slug = body.slug.trim();
    if (body.description !== undefined)
      updateData.description = body.description
        ? body.description.trim()
        : null;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.isOnline !== undefined) updateData.isOnline = body.isOnline;
    if (body.location !== undefined)
      updateData.location = body.location ? body.location.trim() : null;
    if (body.zoomLink !== undefined)
      updateData.zoomLink = body.zoomLink ? body.zoomLink.trim() : null;
    if (body.imageUrl !== undefined)
      updateData.imageUrl = body.imageUrl ? body.imageUrl.trim() : null;
    if (body.mapLocation !== undefined)
      updateData.mapLocation = body.mapLocation
        ? body.mapLocation.trim()
        : null;
    if (body.isPublished !== undefined)
      updateData.isPublished = body.isPublished;

    // Handle speakers (embedded type)
    if (body.speakers !== undefined) {
      if (Array.isArray(body.speakers)) {
        const processedSpeakers = body.speakers
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
            designation: speaker.designation
              ? speaker.designation.trim()
              : null,
            avatarUrl: speaker.avatarUrl,
          }));

        updateData.speakers = processedSpeakers;
      } else {
        // Clear speakers if not an array
        updateData.speakers = [];
      }
    }

    // Handle FAQs (embedded type)
    if (body.faqs !== undefined) {
      if (Array.isArray(body.faqs)) {
        const processedFaqs = body.faqs
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

        updateData.faqs = processedFaqs;
      } else {
        // Clear FAQs if not an array
        updateData.faqs = [];
      }
    }

    console.log("Update data:", updateData); // Debug log

    const updatedEvent = await db.event.update({
      where: { id },
      data: updateData,
      include: {
        attendees: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);

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
        error: "Failed to update event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events/[id] - Delete an event
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    // Check if event exists
    const existingEvent = await db.event.findUnique({
      where: { id },
      include: {
        attendees: true,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 }
      );
    }

    // Check if event has attendees (optional - you might want to prevent deletion)
    if (existingEvent.attendees.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete event with registered attendees",
          details: `Event has ${existingEvent.attendees.length} registered attendees`,
        },
        { status: 409 }
      );
    }

    await db.event.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
