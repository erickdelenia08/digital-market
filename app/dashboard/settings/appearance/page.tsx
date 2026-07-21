import { Metadata } from "next"
import { AppearanceForm } from "./appearance-form"

export const metadata: Metadata = {
  title: "Appearance Settings",
  description: "Customize the application appearance",
}

export default function AppearancePage() {
  return <AppearanceForm />
}
