"use server"

import { prisma } from "@/lib/db"
import * as bcrypt from "bcryptjs"
import { z } from "zod"

import { RegisterSchema } from "@/schemas"
import { sendWelcomeEmail } from "@/lib/mail"

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
  const parsed = RegisterSchema.safeParse(values)

  if (!parsed.success) {
    return { error: "Invalid fields" }
  }

  const { name, email, password } = parsed.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email already in use" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    await sendWelcomeEmail(email, name)

    return { success: "User created successfully" }
  } catch {
    return { error: "Something went wrong" }
  }
}
