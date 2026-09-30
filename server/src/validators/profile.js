import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name must not exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{7,20}$/, "Phone number must be between 7 and 20 digits, spaces or hyphens")
    .optional()
    .nullable()
    .or(z.literal("")),
  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(60, "State must not exceed 60 characters"),
  district: z
    .string()
    .trim()
    .min(2, "District must be at least 2 characters")
    .max(60, "District must not exceed 60 characters"),
  language: z.enum(["en", "hi", "mr"], {
    errorMap: () => ({ message: "Language must be en, hi, or mr" })
  }).default("en"),
  preferred_unit: z.enum(["acre", "hectare"], {
    errorMap: () => ({ message: "Preferred unit must be acre or hectare" })
  }).default("acre"),
}).strict();
