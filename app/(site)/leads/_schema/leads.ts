import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, {
    message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে।",
  }),
  email: z.string().email({
    message: "অনুগ্রহ করে একটি বৈধ ইমেইল লিখুন।",
  }),
  phone: z
    .string()
    .min(1, { message: "অনুগ্রহ করে একটি ফোন নাম্বার লিখুন।" })
    .refine((val) => val.length === 11, {
      message: "ফোন নাম্বার মোট ১১ সংখ্যার হতে হবে।",
    }),
  facebookProfile: z
    .string()
    .url({
      message: "অনুগ্রহ করে একটি বৈধ URL লিখুন।",
    })
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url({
      message: "অনুগ্রহ করে একটি বৈধ URL লিখুন।",
    })
    .optional()
    .or(z.literal("")),
  whatsapp: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 11, {
      message: "ফোন নাম্বার মোট ১১ সংখ্যার হতে হবে।",
    }),
  courseId: z.string().optional(),
  eventId: z.string().optional(),
  certificationId: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
