// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { priceId: string } }
) {
  try {
    const { priceId } = params;

    const { userId } = await getServerUserSession(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const priceRecord = await db.price.findUnique({
      where: {
        id: priceId,
      },
      include: {
        course: true,
      },
    });

    if (!priceRecord || priceRecord?.course?.teacherId !== userId) {
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
