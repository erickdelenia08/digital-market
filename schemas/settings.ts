import * as z from "zod"

export const ProfileSchema = z.object({
  name: z.optional(z.string().min(1, "Name is required")),
  email: z.optional(z.string().email("Invalid email")),
  image: z.optional(z.string()),
})

export type ProfileValues = z.infer<typeof ProfileSchema>

export const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type PasswordValues = z.infer<typeof PasswordSchema>
