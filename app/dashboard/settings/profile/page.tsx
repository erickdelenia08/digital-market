import { Metadata } from "next"
import { ProfileForm } from "./profile-form"

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your profile information",
}

export default function SettingsProfilePage() {
  return <ProfileForm />
}
