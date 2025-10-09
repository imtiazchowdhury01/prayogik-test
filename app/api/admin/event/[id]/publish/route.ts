// api/admin/event/[id]/publish/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, isAdmin } = await getServerUserSession(req);

    if (!userId || !isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await db.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    const hasRequiredFields = event.title && event.slug && event.type;

    if (!hasRequiredFields) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    const publishedEvent = await db.event.update({
      where: {
        id: params.id,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedEvent);
  } catch (error) {
    console.error("[EVENT_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
