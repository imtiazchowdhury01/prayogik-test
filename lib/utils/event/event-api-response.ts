import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Utility functions
export function createEventErrorResponse(
  message: string,
  status: number = 400,
  details?: string
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}


export function createEventSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export async function checkSlugUniqueness(slug: string, excludeId?: string) {
  const existingEvent = await db.event.findUnique({
    where: { slug },
  });

  if (existingEvent && existingEvent.id !== excludeId) {
    return false;
  }
  return true;
}

export function processEventData(data: any) {
  const processedData = { ...data };

  // Convert date string to Date object
  if (processedData.date) {
    processedData.date = new Date(processedData.date);
  }

  // Process speakers
  if (processedData.speakers) {
    processedData.speakers = processedData.speakers.map((speaker: any) => ({
      name: speaker.name.trim(),
      designation: speaker.designation?.trim() || null,
      avatarUrl: speaker.avatarUrl,
    }));
  }

  // Process FAQs
  if (processedData.faqs) {
    processedData.faqs = processedData.faqs.map((faq: any) => ({
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    }));
  }

  // Trim string fields
  const stringFields = ['title', 'slug', 'description', 'location', 'zoomLink', 'imageUrl', 'mapLocation'];
  stringFields.forEach(field => {
    if (processedData[field]) {
      processedData[field] = processedData[field].trim();
    }
  });

  return processedData;
}