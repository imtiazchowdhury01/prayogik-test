// api/certifications/prices/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Frequency } from "@prisma/client";
import type { Prisma } from "@prisma/client";

// ========== TYPE DEFINITIONS ==========

interface PriceData {
  id?: string;
  certificationId: string;
  isFree?: boolean;
  isSubscriptionPrice?: boolean;
  regularAmount?: number;
  discountedAmount?: number | null;
  discountExpiresOn?: string | null;
  duration?: string | number;
  frequency: Frequency;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

type Price = Prisma.PriceGetPayload<{}>;

// ========== POST HANDLER ==========

export async function POST(
  request: NextRequest
): Promise<NextResponse<Price[] | ErrorResponse>> {
  try {
    const pricesData: PriceData[] = await request.json();

    // Validate required data
    const missingData = pricesData.some((price) => !price.certificationId);

    if (missingData) {
      return NextResponse.json(
        { message: "Missing required data: certificationId!" },
        { status: 400 }
      );
    }

    // Check which prices already exist
    const existingPrices = await Promise.all(
      pricesData.map(async (priceData) => {
        if (priceData.id) {
          return await db.price.findUnique({
            where: { id: priceData.id },
          });
        }
        return null;
      })
    );

    // Upsert prices
    const upsertPromises = pricesData.map((priceData, index) => {
      const existingPrice = existingPrices[index];

      // Parse duration
      let parsedDuration: number | null = null;
      if (priceData.duration) {
        if (priceData.duration === "NA" || priceData.duration === 0) {
          parsedDuration = null;
        } else {
          parsedDuration =
            typeof priceData.duration === "string"
              ? parseInt(priceData.duration, 10)
              : priceData.duration;
        }
      }

      // Parse discountExpiresOn
      let parsedDiscountExpiry: Date | null = null;
      if (priceData.discountExpiresOn) {
        parsedDiscountExpiry = new Date(priceData.discountExpiresOn);
      }

      const priceDataToSave: Prisma.PriceUpdateInput | Prisma.PriceCreateInput =
        {
          isFree: priceData.isFree ?? false,
          isSubscriptionPrice: priceData.isSubscriptionPrice ?? false,
          regularAmount: priceData.regularAmount ?? 0,
          discountedAmount: priceData.discountedAmount ?? null,
          discountExpiresOn: parsedDiscountExpiry,
          duration: parsedDuration,
          frequency: priceData.frequency,
          certification: {
            connect: {
              id: priceData.certificationId,
            },
          },
        };

      if (existingPrice) {
        // Update existing price
        return db.price.update({
          where: { id: priceData.id },
          data: priceDataToSave,
        });
      } else {
        // Create new price
        return db.price.create({
          data: priceDataToSave as Prisma.PriceCreateInput,
        });
      }
    });

    const prices = await Promise.all(upsertPromises);

    return NextResponse.json(prices, { status: 201 });
  } catch (error) {
    console.error("[UPSERT_PRICES_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to upsert prices" },
      { status: 500 }
    );
  }
}

// ========== DELETE HANDLER ==========

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<null | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const certificationId = searchParams.get("certificationId");

    if (!certificationId) {
      return NextResponse.json(
        { message: "Certification ID is required" },
        { status: 400 }
      );
    }

    const deletedPrices = await db.price.deleteMany({
      where: {
        certificationId,
      },
    });

    if (deletedPrices.count === 0) {
      return NextResponse.json(
        { message: "No prices found for this certification" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_PRICES_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to delete prices", error: String(error) },
      { status: 500 }
    );
  }
}

// ========== GET HANDLER ==========

export async function GET(
  request: NextRequest
): Promise<NextResponse<Price[] | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const certificationId = searchParams.get("certificationId");

    if (!certificationId) {
      return NextResponse.json(
        { message: "Missing certificationId parameter." },
        { status: 400 }
      );
    }

    const prices = await db.price.findMany({
      where: {
        certificationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(prices, { status: 200 });
  } catch (error) {
    console.error("[GET_PRICES_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch prices." },
      { status: 500 }
    );
  }
}
