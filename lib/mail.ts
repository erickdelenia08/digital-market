import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { ResetPasswordEmail } from "@/emails/reset-password"
import { WelcomeEmail } from "@/emails/greeting-user"
import OrderSuccessEmail from "@/emails/order-succes"

import * as dotenv from "dotenv";
dotenv.config();

const port = parseInt(process.env.MAIL_PORT || "587");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: port,
  secure: port === 465,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
})

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Acme Inc"
  const fromName = process.env.MAIL_FROM_NAME || appName

  const emailHtml = await render(ResetPasswordEmail({ resetLink }), {
    pretty: false,
  })

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
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login`

  const emailHtml = await render(WelcomeEmail({
    userFirstName: name,
    loginUrl
  }), {
    pretty: false,
  })

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: `Welcome to ${appName}!`,
    html: emailHtml,
  })
}


interface SendOrderSuccessEmailParams {
  email: string
  name: string
  orderId: string
  totalAmount: string
}

export async function sendOrderSuccessEmail({
  email,
  name,
  orderId,
  totalAmount,
}: SendOrderSuccessEmailParams) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "CodeGraph"
  const fromName = process.env.MAIL_FROM_NAME || appName

  // Direct URL ke halaman library / download pengguna
  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/library`

  const emailHtml = await render(
    OrderSuccessEmail({
      customerName: name,
      orderId,
      totalAmount,
      downloadUrl,
    }), {
    pretty: false,
  }
  )

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: `Payment Confirmed! Your files are ready for Order #${orderId}`,
    html: emailHtml,
  })
}
