"use server"

import { prisma } from "@/lib/db"
import * as bcrypt from "bcryptjs"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { sendPasswordResetEmail } from "@/lib/mail"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export async function requestPasswordReset(email: string) {
  const parsed = forgotPasswordSchema.safeParse({ email })

  if (!parsed.success) {
    return { error: "Invalid email" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist for security
      return { success: "If an account exists, a reset link has been sent." }
    }

    const token = uuidv4()
    const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    })

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // Send reset email
    await sendPasswordResetEmail(email, token)

    return { success: "If an account exists, a reset link has been sent." }
  } catch {
    return { error: "Something went wrong" }
  }
}

export async function resetPassword(values: z.infer<typeof resetPasswordSchema>) {
  const parsed = resetPasswordSchema.safeParse(values)

  if (!parsed.success) {
    return { error: "Invalid fields" }
  }

  const { password, token } = parsed.data

  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!existingToken || existingToken.expires < new Date()) {
      return { error: "Invalid or expired token" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    })

    return { success: "Password reset successful" }
  } catch {
    return { error: "Something went wrong" }
  }
}
