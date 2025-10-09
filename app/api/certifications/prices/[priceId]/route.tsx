// api/certifications/prices/[priceId]/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    priceId: string;
  };
}

interface SuccessResponse {
  message: string;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

// ========== DELETE HANDLER ==========

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { priceId } = params;

    if (!priceId) {
      return NextResponse.json({ message: "Missing priceId" }, { status: 400 });
    }

    const { userId, isAdmin } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the price record with certification
    const priceRecord = await db.price.findUnique({
      where: {
        id: priceId,
      },
      include: {
        certification: {
          select: {
            id: true,
            teacherProfileId: true,
          },
        },
      },
    });

    if (!priceRecord) {
      return NextResponse.json({ message: "Price not found" }, { status: 404 });
    }

    // Check authorization if not admin
    if (!isAdmin) {
      const teacherProfileId = await useTeacherProfile(userId);

      if (!teacherProfileId) {
        return new NextResponse("Unauthorized - Not a teacher", {
          status: 401,
        });
      }

      // Check if the price belongs to a certification owned by this teacher
      if (
        priceRecord.certification &&
        priceRecord.certification.teacherProfileId !== teacherProfileId
      ) {
        return new NextResponse(
          "Unauthorized - You don't own this certification",
          { status: 403 }
        );
      }
    }

    // Delete the price
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
    console.error("[DELETE_PRICE_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
