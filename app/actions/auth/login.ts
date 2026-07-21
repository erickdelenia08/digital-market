"use server"

import * as z from "zod"
import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { verifyTwoFactorToken } from "@/lib/totp"

import { LoginSchema } from "@/schemas"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, code } = validatedFields.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" }
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password)

  if (!passwordsMatch) {
    return { error: "Invalid credentials!" }
  }

  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      if (!existingUser.twoFactorSecret) {
        return { error: "2FA is enabled but no secret is set!" }
      }

      const isValid = await verifyTwoFactorToken(code, existingUser.twoFactorSecret)

      if (!isValid) {
        return { error: "Invalid code!" }
      }

      const existingConfirmation = await prisma.twoFactorConfirmation.findUnique({
        where: { userId: existingUser.id },
      })

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        })
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })
    } else {
      return { twoFactor: true }
    }
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
      redirect: false,
    })

    if (result?.error) {
      return { error: "Invalid credentials!" }
    }

    return { success: "Logged in!" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error
  }
}
