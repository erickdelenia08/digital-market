import { z } from "zod";

export const productMediaSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "URL is required"),
  type: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
});

export const productAssetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["FILE", "LINK"]).default("FILE"),
  fileUrl: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  fileSize: z.number().optional().nullable(),
  extension: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  coverImage: z.string().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  media: z.array(productMediaSchema).default([]),
  digitalAssets: z.array(productAssetSchema).default([]),
});

export type ProductInput = z.input<typeof productSchema>;
