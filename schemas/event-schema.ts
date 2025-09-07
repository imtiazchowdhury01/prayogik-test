// lib/validations/event-schemas.ts
import { z } from "zod";

// Enum schemas matching your Prisma schema
export const EventTypeSchema = z.enum(["PAID", "FREE"]);
export const EventStatusSchema = z.enum([
  "DRAFT",
  "UPCOMING",
  "WAITING",
  "CLOSED",
]);

// Embedded type schemas
export const SpeakerSchema = z.object({
  name: z.string().min(1, "Speaker name is required").trim(),
  designation: z.string().optional(),
  avatarUrl: z.string().min(1, "Speaker image is required"),
});

export const FaqSchema = z.object({
  question: z.string().min(1, "Question is required").trim(),
  answer: z.string().min(1, "Answer is required").trim(),
});

// Base event schema with all possible fields
const BaseEventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .trim(),
  description: z.string().max(2000, "Description too long").optional(),
  price: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    if (typeof val === "string") {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }, z.number().positive().optional()),
  date: z.string({ required_error: "Date is required" }),
  type: EventTypeSchema,
  status: EventStatusSchema,
  isOnline: z.boolean().default(false),
  location: z.string().max(500, "Location too long").optional(),
  zoomLink: z.string().url("Invalid Zoom link").optional().or(z.literal("")),
  imageUrl: z.string().url("Invalid image URL").optional(),
  mapLocation: z.string().max(500, "Map location too long").optional(),
  isPublished: z.boolean().default(false),
  speakers: z
    .array(SpeakerSchema)
    .max(10, "Maximum 10 speakers allowed")
    .default([]),
  faqs: z.array(FaqSchema).max(20, "Maximum 20 FAQs allowed").default([]),
});

// Create Event Schema - all required fields must be present
export const CreateEventSchema = BaseEventSchema.refine(
  (data) => {
    // Location is required for offline events
    if (!data.isOnline && (!data.location || data.location.trim() === "")) {
      return false;
    }
    return true;
  },
  {
    message: "Location is required for offline events",
    path: ["location"],
  }
)
  .refine(
    (data) => {
      // Price is required for paid events
      if (
        data.type === "PAID" &&
        (data.price === null || data.price === undefined || data.price <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Price is required and must be greater than 0 for paid events",
      path: ["price"],
    }
  )
  .refine(
    (data) => {
      // Validate zoom link for online events
      if (data.isOnline && data.zoomLink && data.zoomLink !== "") {
        return z.string().url().safeParse(data.zoomLink).success;
      }
      return true;
    },
    {
      message: "Valid Zoom link is required for online events",
      path: ["zoomLink"],
    }
  );

// Update Event Schema - all fields are optional
export const UpdateEventSchema = BaseEventSchema.partial()
  .refine(
    (data) => {
      // Only validate location if isOnline is being set to false
      if (
        data.isOnline === false &&
        (!data.location || data.location.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Location is required when setting event to offline",
      path: ["location"],
    }
  )
  .refine(
    (data) => {
      // Only validate price if type is being set to PAID
      if (
        data.type === "PAID" &&
        (data.price === null || data.price === undefined || data.price <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Price is required and must be greater than 0 when setting event to paid",
      path: ["price"],
    }
  )
  .refine(
    (data) => {
      // Validate zoom link if provided
      if (data.isOnline && data.zoomLink && data.zoomLink !== "") {
        return z.string().url().safeParse(data.zoomLink).success;
      }
      return true;
    },
    {
      message: "Valid Zoom link is required for online events",
      path: ["zoomLink"],
    }
  );

// Type exports
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type SpeakerInput = z.infer<typeof SpeakerSchema>;
export type FaqInput = z.infer<typeof FaqSchema>;
export type EventType = z.infer<typeof EventTypeSchema>;
export type EventStatus = z.infer<typeof EventStatusSchema>;

// Constants for frontend dropdowns
export const EVENT_TYPES = [
  { value: "FREE" as const, label: "Free Event" },
  { value: "PAID" as const, label: "Paid Event" },
];

export const EVENT_STATUS_OPTIONS = [
  { value: "DRAFT" as const, label: "Draft" },
  { value: "UPCOMING" as const, label: "Upcoming" },
  { value: "WAITING" as const, label: "Waiting" },
  { value: "CLOSED" as const, label: "Closed" },
];

// Validation helper functions
export const validateEventSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug);
};

export const isEventPaid = (type: EventType): boolean => {
  return type === "PAID";
};

export const requiresLocation = (isOnline: boolean): boolean => {
  return !isOnline;
};

export const isEventUpcoming = (date: Date): boolean => {
  return new Date(date) > new Date();
};

export const canRegisterForEvent = (event: {
  status: EventStatus;
  date: Date;
  isPublished: boolean;
}): boolean => {
  return (
    event.isPublished &&
    event.status === "UPCOMING" &&
    isEventUpcoming(event.date)
  );
};
