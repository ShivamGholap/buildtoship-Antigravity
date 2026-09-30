import { z } from "zod";

export const uuidSchema = z.string().uuid("Invalid UUID format");

export const idParamSchema = z.object({
  id: uuidSchema
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});
