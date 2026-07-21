import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { ResetPasswordEmail } from "@/emails/reset-password"
import { WelcomeEmail } from "@/emails/greeting-user"
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587"),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
})

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Acme Inc"
  const fromName = process.env.MAIL_FROM_NAME || appName

  const emailHtml = await render(ResetPasswordEmail({ resetLink }))

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: `[${appName}] Reset your password`,
    html: emailHtml,
  })
}


// Fungsi baru untuk kirim email selamat datang
export async function sendWelcomeEmail(email: string, name: string) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Acme Inc"
  const fromName = process.env.MAIL_FROM_NAME || appName
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`

  const emailHtml = await render(WelcomeEmail({
    userFirstName: name,
    loginUrl
  }))

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: `Selamat datang di ${appName}!`,
    html: emailHtml,
  })
}

