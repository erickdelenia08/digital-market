import { z } from "zod";

export const reviewSchema = z.object({
    rating: z
        .number({ message: "Rating wajib diisi" })
        .min(1, "Minimal rating 1 bintang")
        .max(5, "Maksimal rating 5 bintang"),
    comment: z
        .string()
        .max(1000, "Komentar maksimal 1000 karakter")
        .optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;