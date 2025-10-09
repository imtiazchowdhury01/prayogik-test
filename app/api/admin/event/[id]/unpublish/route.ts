// api/admin/event/[id]/unpublish/route.ts
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

    const unpublishedEvent = await db.event.update({
      where: {
        id: params.id,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedEvent);
  } catch (error) {
    console.error("[EVENT_UNPUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
