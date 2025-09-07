import { z } from "zod";
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "নাম অন্তত ৩ অক্ষরের হতে হবে।" })
    .max(50, { message: "নাম সর্বোচ্চ ৫০ অক্ষরের হতে পারবে।" }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "সঠিক ইমেইল ঠিকানা লিখুন।" })
    .max(100, { message: "ইমেইল সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।" }),

  subject: z
    .string()
    .trim()
    .min(2, { message: "বিষয় অন্তত ২ অক্ষরের হতে হবে।" })
    .max(100, { message: "বিষয় সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।" }),

  message: z
    .string()
    .trim()
    .min(2, { message: "অন্তত ২ অক্ষরের হতে হবে।" })
    .max(500, { message: "সর্বোচ্চ ৫০০ অক্ষরের হতে পারবে।" }),
});
