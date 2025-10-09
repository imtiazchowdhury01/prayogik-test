// api/admin/event/[id]/route.ts
import { db } from "@/lib/db";
import {
  checkSlugUniqueness,
  createEventErrorResponse,
  createEventSuccessResponse,
  processEventData,
} from "@/lib/utils/event/event-api-response";
import { UpdateEventSchema } from "@/schemas/event-schema";
import { EventType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    const event = await db.event.findUnique({
      where: { id },
      include: {
        attendees: {
          select: {
            id: true,
            userId: true,
            isApproved: true,
            registeredAt: true,
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

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    if (!id) {
      return createEventErrorResponse("Event ID is required", 400);
    }

    const body = await request.json();

    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return createEventErrorResponse("Event not found", 404);
    }

    const validationResult = UpdateEventSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return createEventErrorResponse("Validation error", 400, errorMessages);
    }

    const validatedData = validationResult.data;

    if (validatedData.slug && validatedData.slug !== existingEvent.slug) {
      const isSlugUnique = await checkSlugUniqueness(validatedData.slug, id);
      if (!isSlugUnique) {
        return createEventErrorResponse(
          "Event slug already exists",
          409,
          "Please choose a different slug"
        );
      }
    }

    if (validatedData.isOnline !== undefined) {
      if (validatedData.isOnline === true) {
        validatedData.location = "";
        validatedData.mapLocation = "";
      } else if (validatedData.isOnline === false) {
        validatedData.zoomLink = "";

        if (!validatedData.location && !existingEvent.location) {
          return createEventErrorResponse(
            "Location is required for offline events",
            400
          );
        }
      }
    }

    if (validatedData.type !== undefined) {
      if (
        validatedData.type === EventType.EOI ||
        validatedData.type === EventType.FREE
      ) {
        validatedData.price = 0;
      } else if (validatedData.type === "PAID") {
        if (!validatedData.price && !existingEvent.price) {
          return createEventErrorResponse(
            "Price is required for paid events",
            400
          );
        }
      }
    }

    const processedData = processEventData(validatedData);

    const updateData = Object.fromEntries(
      Object.entries(processedData).filter(([_, value]) => value !== undefined)
    );

    const updatedEvent = await db.event.update({
      where: { id },
      data: updateData,
      include: {
        attendees: true,
      },
    });

    return createEventSuccessResponse(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return createEventErrorResponse(
          "Event slug already exists",
          409,
          "Please choose a different slug"
        );
      }

      if (error.message.includes("Record to update not found")) {
        return createEventErrorResponse("Event not found", 404);
      }
    }

    return createEventErrorResponse(
      "Failed to update event",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

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
