import { Metadata } from "next"
import { PasswordForm } from "./password-form"

export const metadata: Metadata = {
  title: "Password Settings",
  description: "Update your account password",
}

export default function SettingsPasswordPage() {
  return <PasswordForm />
}
