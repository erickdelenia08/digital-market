import { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { SettingsSidebarNav } from "@/components/settings-sidebar-nav"

export const metadata: Metadata = {
  title: {
    default: "Settings",
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || "Acme Inc"}`,
  },
  description: "Manage your account settings and preferences.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/dashboard/settings/profile",
  },
  {
    title: "Password",
    href: "/dashboard/settings/password",
  },
  {
    title: "Appearance",
    href: "/dashboard/settings/appearance",
  },
  {
    title: "Two-Factor Auth",
    href: "/dashboard/settings/2fa",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-10 lg:pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SettingsSidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
