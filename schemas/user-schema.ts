import { z } from "zod";

export const userRoleEnum = z.enum(["USER", "ADMIN"]);

// Base schema for shared fields
export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email format"),
  role: userRoleEnum.default("USER"),
});

// Schema for user creation (password is required)
export const createUserSchema = userSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Schema for user update (password is optional)
export const updateUserSchema = userSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
