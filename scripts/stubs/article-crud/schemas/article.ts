import * as z from "zod"

export const ArticleSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  content: z.string().min(1, {
    message: "Content is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug must only contain lowercase letters, numbers, and hyphens",
  }),
  published: z.boolean(),
})

export type ArticleValues = z.infer<typeof ArticleSchema>
