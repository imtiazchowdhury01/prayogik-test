// @ts-nocheck
import { z } from "zod";
import { TeacherExpertiseLevel } from "@prisma/client";

export const generalSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  dateOfBirth: z.date({ message: "Date of birth is required!" }),
  gender: z.string({ message: "Gender is required!" }),
  nationality: z.string().optional(),
  bio: z.string().min(50, { message: "Bio is must be at least 50 characters" }),
  education: z
    .array(
      z.object({
        degree: z.string().optional(),
        major: z.string().optional(),
        passingYear: z.string().optional(),
      })
    )
    .optional(),
  phoneNumber: z
    .string({ required_error: "Please enter a phone number" })
    .nonempty("Phone number is required")
    .min(11, "Must be a valid 11 digit phone number (01XXXXXXXXX)")
    .max(11, "Must be a valid 11 digit phone number (01XXXXXXXXX)"),
});
export const contactSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  facebook: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  linkedin: z.string().url({ message: "Invalid LinkedIn url..." }),
  twitter: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  youtube: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  website: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
  others: z
    .string()
    .url({ message: "Invalid URL format" })
    .or(z.literal(""))
    .optional(),
});

export const teacherFormSchema = z.object({
  subjectSpecializations: z
    .array(z.string())
    .min(1, "Subject specializations cannot be empty"),
  expertiseLevel: z
    .enum(Object.keys(TeacherExpertiseLevel), {
      message: "You need to select skill level.",
    })
    .optional(),
  certifications: z.array(z.string()).optional(),
  yearsOfExperience: z.string().optional(),
});
