import { z } from "zod";

export const postCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export const postTagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  // slug: z.string().min(1, "Slug is required"),
  slug: z.string().optional()
});

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.union([z.string(), z.date()]).optional().nullable(), // Allow string or date to handle form inputs easily
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  relatedProductId: z.string().optional().nullable(),
  tags: z.array(postTagSchema).default([]),
});

// export type PostInput = z.infer<typeof postSchema>;
export type PostInput = z.input<typeof postSchema>;
export type PostCategoryInput = z.infer<typeof postCategorySchema>;
export type PostTagInput = z.infer<typeof postTagSchema>;
