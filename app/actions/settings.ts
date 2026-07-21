"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ProfileSchema, ProfileValues, PasswordSchema, PasswordValues } from "@/schemas/settings"
import { revalidatePath } from "next/cache"
import { uploadImage, deleteImage } from "@/lib/upload"
import * as bcrypt from "bcryptjs"

export const updatePassword = async (values: PasswordValues) => {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const validatedFields = PasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { currentPassword, newPassword } = validatedFields.data

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !user.password) {
      return { error: "User not found" }
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password)

    if (!passwordsMatch) {
      return { error: "Incorrect current password" }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      },
    })

    return { success: "Password updated successfully" }
  } catch {
    return { error: "Internal server error" }
  }
}

export const updateProfile = async (values: ProfileValues) => {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const validatedFields = ProfileSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name, image } = validatedFields.data
  let imagePath: string | null | undefined = image

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    })

    if (image && image.startsWith("data:image")) {
      imagePath = await uploadImage(image, session.user.id, currentUser?.image, "uploads")
    } else if (image === "" && currentUser?.image) {
      await deleteImage(currentUser.image)
      imagePath = null
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        image: imagePath,
      },
    })

    revalidatePath("/dashboard/settings/profile")
    return { 
      success: "Profile updated successfully",
      imagePath: imagePath 
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Internal server error" }
  }
}
