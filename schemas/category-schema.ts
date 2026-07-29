import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().max(500, 'maximal description is 500 characters').optional(),
  icon: z.string().optional()
});

export type CategoryInput = z.infer<typeof categorySchema>;
