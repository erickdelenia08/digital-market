"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { generateTwoFactorSecret, generateTwoFactorQrCodeUri, generateQrCodeDataUrl, verifyTwoFactorToken } from "@/lib/totp"

export const generateTwoFactorSetup = async () => {
  const session = await auth()

  if (!session?.user || !session.user.email) {
    return { error: "Unauthorized" }
  }

  const secret = generateTwoFactorSecret()
  const uri = generateTwoFactorQrCodeUri(session.user.email, secret)
  const qrCode = await generateQrCodeDataUrl(uri)

  return { secret, qrCode }
}

export const enableTwoFactor = async (code: string, secret: string) => {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const isValid = await verifyTwoFactorToken(code, secret)

  if (!isValid) {
    return { error: "Invalid code!" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: secret,
      isTwoFactorEnabled: true,
    }
  })

  revalidatePath("/dashboard/settings/2fa")

  return { success: "2FA Enabled!" }
}

export const updateSettings = async (values: { isTwoFactorEnabled?: boolean }) => {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!dbUser) {
    return { error: "User not found" }
  }

  // If disabling 2FA, clear the secret
  const data: { isTwoFactorEnabled?: boolean; twoFactorSecret?: string | null } = { ...values }
  if (values.isTwoFactorEnabled === false) {
    data.twoFactorSecret = null
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data
  })

  revalidatePath("/dashboard/settings/2fa")
  
  return { success: "Settings updated!" }
}
