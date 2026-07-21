import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  coverImage: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
