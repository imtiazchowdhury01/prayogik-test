// api/certifications/prices/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Handle POST requests to create or update prices
export async function POST(request: Request) {
  const pricesData = await request.json();

  const missingData = pricesData.some(
    (price: any) => !price.certificationId // Only check for certificationId as mandatory
  );

  if (missingData) {
    return NextResponse.json(
      { message: "Missing required data: certificationId!" },
      { status: 400 }
    );
  }

  try {
    const existingPrices = await Promise.all(
      pricesData.map(async (priceData: any) => {
        if (priceData.id) {
          return db.price.findUnique({
            where: { id: priceData.id },
          });
        }
        return null;
      })
    );

    // Upsert prices
    const upsertPromises = pricesData.map((priceData: any, index: number) => {
      const existingPrice = existingPrices[index];

      const priceDataToSave = {
        isFree: priceData.isFree ?? false, // Default to false if undefined
        isSubscriptionPrice: priceData.isSubscriptionPrice ?? false,
        regularAmount: priceData.regularAmount ?? 0, // Allow null
        discountedAmount: priceData.discountedAmount ?? null, // Allow null
        discountExpiresOn: priceData.discountExpiresOn ?? null, // Allow null
        duration:
          priceData.duration === "NA" ? 0 : parseInt(priceData.duration),
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
          data: priceDataToSave,
        });
      }
    });

    // Execute all promises in parallel
    const prices = await Promise.all(upsertPromises);

    return NextResponse.json(prices, { status: 201 });
  } catch (error) {
    console.error("Failed to upsert prices", error);
    return NextResponse.json(
      { message: "Failed to upsert prices" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const certificationId = searchParams.get("certificationId");

  if (!certificationId) {
    return NextResponse.json(
      { message: "Course ID is required" },
      { status: 400 }
    );
  }

  try {
    // Delete all prices associated with the course ID
    const deletedPrices = await db.price.deleteMany({
      where: { 
        certificationId
       },
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
    console.error("Failed to delete prices:", error);
    return NextResponse.json(
      { message: "Failed to delete prices", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Extract the certificationId from the query parameters
  const { searchParams } = new URL(request.url);
  const certificationId = searchParams.get("certificationId");

  // Validate the certificationId parameter
  if (!certificationId) {
    return NextResponse.json(
      { message: "Missing certificationId parameter." },
      { status: 400 }
    );
  }

  try {
    // Fetch prices associated with the provided certificationId
    const prices = await db.price.findMany({
      where: {
        certificationId: certificationId, // Filter prices by certificationId
      },
    });

    // Return the fetched prices
    return NextResponse.json(prices, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    return NextResponse.json(
      { message: "Failed to fetch prices." },
      { status: 500 }
    );
  }
}