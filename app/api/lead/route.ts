import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leadFormSchema } from "@/app/(site)/leads/_schema/leads";
import { LeadStatus } from "@prisma/client";

// Extended schema for API route that includes search params
const leadApiSchema = leadFormSchema
  .extend({
    type: z.string().optional(),
  })
  .refine((data) => data.courseId || data.eventId || data.certificationId, {
    message:
      "At least one ID (courseId, eventId, or certificationId) is required",
    path: ["ids"],
  });

// Search params schema
const searchParamsSchema = z.object({
  type: z.string().optional(),
  courseId: z.string().optional(),
  eventId: z.string().optional(),
  certificationId: z.string().optional(),
  status: z
    .enum([LeadStatus.INTERSTED, LeadStatus.WAITING])
    .default(LeadStatus.WAITING),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Get search params from URL
    const searchParams = request.nextUrl.searchParams;
    const searchParamsData = {
      type: searchParams.get("type") || undefined,
      courseId: searchParams.get("courseId") || undefined,
      eventId: searchParams.get("eventId") || undefined,
      certificationId: searchParams.get("certificationId") || undefined,
      status: (searchParams.get("status") as LeadStatus) || LeadStatus.WAITING,
    };

    // Validate search params
    const validatedSearchParams = searchParamsSchema.parse(searchParamsData);

    const mergedData = {
      ...body,
      type: validatedSearchParams.type || body.type,
      courseId: validatedSearchParams.courseId || body.courseId,
      eventId: validatedSearchParams.eventId || body.eventId,
      certificationId:
        validatedSearchParams.certificationId || body.certificationId,
    };

    // Validate the merged data
    const validatedData = leadApiSchema.parse(mergedData);

    // Check for existing lead with same email and any of the IDs
    const existingLead = await db.lead.findFirst({
      where: {
        email: validatedData.email,
        OR: [
          // Check if courseId exists and matches
          ...(validatedData.courseId
            ? [{ courseId: validatedData.courseId }]
            : []),
          // Check if eventId exists and matches
          ...(validatedData.eventId
            ? [{ eventId: validatedData.eventId }]
            : []),
          // Check if certificationId exists and matches
          ...(validatedData.certificationId
            ? [{ certificationId: validatedData.certificationId }]
            : []),
        ],
      },
      select: {
        id: true,
        email: true,
        courseId: true,
        eventId: true,
        certificationId: true,
        createdAt: true,
      },
    });

    // If duplicate found, return appropriate message
    if (existingLead) {
      let duplicateType = "";
      if (
        existingLead.courseId &&
        validatedData.courseId &&
        existingLead.courseId === validatedData.courseId
      ) {
        duplicateType = "কোর্স";
      } else if (
        existingLead.eventId &&
        validatedData.eventId &&
        existingLead.eventId === validatedData.eventId
      ) {
        duplicateType = "ইভেন্ট";
      } else if (
        existingLead.certificationId &&
        validatedData.certificationId &&
        existingLead.certificationId === validatedData.certificationId
      ) {
        duplicateType = "সার্টিফিকেশন";
      }

      return NextResponse.json(
        {
          success: false,
          message: `এই ইমেইল দিয়ে ইতিমধ্যে ${
            duplicateType ? `${duplicateType} এর জন্য` : ""
          } রেজিস্ট্রেশন করা হয়েছে।`,
          duplicate: true,
          existingData: {
            registeredAt: existingLead.createdAt,
            type: duplicateType,
          },
        },
        { status: 409 }
      );
    }

    // Prepare data for database insertion
    const leadData = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null,
      facebookProfile: validatedData.facebookProfile || null,
      linkedin: validatedData.linkedin || null,
      whatsapp: validatedData.whatsapp || null,
      courseId: validatedData.courseId || null,
      eventId: validatedData.eventId || null,
      certificationId: validatedData.certificationId || null,
      status: validatedSearchParams.status,
    };

    // Create lead - UNCOMMENTED
    const createdLead = await db.lead.create({
      data: leadData,
    });
    // console.log("createdLead result:", createdLead);

    return NextResponse.json(
      {
        success: true,
        message:
          "আপনি সফলভাবে ওয়েটিং লিস্টে রেজিস্ট্রেশন করেছেন। পরবর্তী আপডেট আমরা আপনাকে ইমেইলের মাধ্যমে জানিয়ে দেব।",
        data: createdLead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      // Check if the error is specifically about missing IDs
      const idError = error.errors.find((err) => err.path.includes("ids"));
      if (idError) {
        return NextResponse.json(
          {
            success: false,
            message:
              "দুঃখিত! কোর্স, ইভেন্ট অথবা সার্টিফিকেশনের যেকোনো আইডি প্রয়োজন।",
            error: idError.message,
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "দুঃখিত! ডেটা যাচাইকরণে সমস্যা হয়েছে",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "দুঃখিত! কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
