import { z } from "zod";
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(50, { message: "Username cannot exceed 50 characters." }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email cannot exceed 100 characters." }),

  subject: z
    .string()
    .trim()
    .min(2, { message: "Subject must be at least 2 characters." })
    .max(100, { message: "Subject cannot exceed 100 characters." }),

  message: z
    .string()
    .trim()
    .min(2, { message: "Message must be at least 2 characters." })
    .max(500, { message: "Message cannot exceed 500 characters." }),
});
