import { Metadata } from "next"
import { AuthLayout } from "@/components/auth-layout"
import { ResetPasswordForm } from "./reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your account password",
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your new password below"
      quote="Sometimes we need a fresh start. This process ensures you can regain control of your account with a secure new password."
      quoteAuthor="Seneca"
      alternateLink={{ text: "Sign In", href: "/login" }}
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
