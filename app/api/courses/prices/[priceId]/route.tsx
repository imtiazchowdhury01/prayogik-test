// api/courses/prices/[priceId]/route.tsx
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    priceId: string;
  };
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { priceId } = params;

    if (!priceId) {
      return NextResponse.json(
        { message: "Price ID is required" },
        { status: 400 }
      );
    }

    const { userId } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const priceRecord = await db.price.findUnique({
      where: {
        id: priceId,
      },
      include: {
        course: {
          select: {
            id: true,
            teacherProfileId: true,
          },
        },
      },
    });

    if (!priceRecord || !priceRecord.course) {
      return new NextResponse("Price not found", { status: 404 });
    }

    // Get teacher profile to verify ownership
    const teacherProfile = await db.teacherProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (
      !teacherProfile ||
      priceRecord.course.teacherProfileId !== teacherProfile.id
    ) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await db.price.delete({
      where: {
        id: priceId,
      },
    });

    return NextResponse.json(
      { message: "Price deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PRICE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
