// @ts-nocheck
import { z } from "zod";
import { TeacherExpertiseLevel } from "@prisma/client";

// export const generalFormSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 3 characters." }),
//   email: z.string().email({ message: "Please enter a valid email address." }),
//   dateOfBirth: z.date().optional(),
//   gender: z.string().optional(),
//   nationality: z.string().optional(),
//   bio: z.string().optional(),
//   phoneNumber: z.string().optional(),
//   city: z.string().optional(),
//   state: z.string().optional(),
//   country: z.string().optional(),
//   zipCode: z.string().optional(),
//   facebook: z
//     .string()
//     .url({ message: "Invalid URL format" })
//     .or(z.literal(""))
//     .optional(),
//   linkedin: z
//     .string()
//     .url({ message: "Invalid URL format" })
//     .or(z.literal(""))
//     .optional(),
//   twitter: z
//     .string()
//     .url({ message: "Invalid URL format" })
//     .or(z.literal(""))
//     .optional(),
//   youtube: z
//     .string()
//     .url({ message: "Invalid URL format" })
//     .or(z.literal(""))
//     .optional(),
//   website: z
//     .string()
//     .url({ message: "Invalid URL format" })
//     .or(z.literal(""))
//     .optional(),
//   others: z
//     .string()
//     .url({ message: "Invalid URL format" })
//     .or(z.literal(""))
//     .optional(),
// });

export const generalSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  dateOfBirth: z.date({ message: "Date of birth is required!" }),
  gender: z.string({ message: "Gender is required!" }),
  nationality: z.string().optional(),
  bio: z.string().min(50, { message: "Bio is must be at least 50 characters" }),
  education: z.array(z.string()).min(1, { message: "Education is required" }),
});
export const contactSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /^\+8801[3-9]\d{8}$/,
      "Must be a valid Bangladesh phone number (+8801XXXXXXXXX)"
    ),
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
  expertiseLevel: z.enum(Object.values(TeacherExpertiseLevel), {
    message: "You need to select skill level.",
  }),
  yearsOfExperience: z.string({ message: "Please select years of experience" }),
  certifications: z
    .array(z.string().url({ message: "Invalid URL format" }))
    .optional(),
});
