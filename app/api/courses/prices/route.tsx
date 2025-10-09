// api/courses/prices/route.tsx
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { Frequency } from "@prisma/client";

interface PriceData {
  id?: string;
  courseId: string;
  isFree?: boolean;
  isSubscriptionPrice?: boolean;
  regularAmount?: number;
  discountedAmount?: number | null;
  discountExpiresOn?: Date | string | null;
  duration?: string | number;
  frequency: Frequency;
}

// Handle POST requests to create or update prices
export async function POST(request: Request) {
  try {
    const pricesData: PriceData[] = await request.json();

    const missingData = pricesData.some((price) => !price.courseId);

    if (missingData) {
      return NextResponse.json(
        { message: "Missing required data: courseId!" },
        { status: 400 }
      );
    }

    const existingPrices = await Promise.all(
      pricesData.map(async (priceData) => {
        if (priceData.id) {
          return db.price.findUnique({
            where: { id: priceData.id },
          });
        }
        return null;
      })
    );

    // Upsert prices
    const upsertPromises = pricesData.map((priceData, index) => {
      const existingPrice = existingPrices[index];

      const priceDataToSave = {
        isFree: priceData.isFree ?? false,
        isSubscriptionPrice: priceData.isSubscriptionPrice ?? false,
        regularAmount: priceData.regularAmount ?? 0,
        discountedAmount: priceData.discountedAmount ?? null,
        discountExpiresOn: priceData.discountExpiresOn
          ? new Date(priceData.discountExpiresOn)
          : null,
        isLifeTime: priceData.frequency === "LIFETIME",
        duration:
          priceData.duration === "NA"
            ? 0
            : typeof priceData.duration === "string"
            ? parseInt(priceData.duration, 10)
            : priceData.duration ?? 0,
        frequency: priceData.frequency,
        courseId: priceData.courseId,
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
          data: priceDataToSave,
        });
      }
    });

    // Execute all promises in parallel
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 }
      );
    }

    // Delete all prices associated with the course ID
    const deletedPrices = await db.price.deleteMany({
      where: { courseId },
    });

    if (deletedPrices.count === 0) {
      return NextResponse.json(
        { message: "No prices found for this course" },
        { status: 404 }
      );
    }

    // For 204 status, don't use json() method
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_PRICES_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to delete prices", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Extract the courseId from the query parameters
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    // Validate the courseId parameter
    if (!courseId) {
      return NextResponse.json(
        { message: "Missing courseId parameter." },
        { status: 400 }
      );
    }

    // Fetch prices associated with the provided courseId
    const prices = await db.price.findMany({
      where: {
        courseId: courseId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Return the fetched prices
    return NextResponse.json(prices, { status: 200 });
  } catch (error) {
    console.error("[GET_PRICES_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch prices." },
      { status: 500 }
    );
  }
}
