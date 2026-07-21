"use client"

import { useMemo, Fragment } from "react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface SiteHeaderProps {
  breadcrumbs?: {
    title: string
    href?: string
  }[]
}

const routeMapping: Record<string, string> = {
  dashboard: "Dashboard",
  settings: "Settings",
  profile: "Profile",
  password: "Password",
  appearance: "Appearance",
  "2fa": "Two-Factor Auth",
}

export function SiteHeader({ breadcrumbs: breadcrumbsProp }: SiteHeaderProps) {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    if (breadcrumbsProp) return breadcrumbsProp

    const segments = pathname.split("/").filter(Boolean)
    return segments
      .map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`
        const title = routeMapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        
        // Simple heuristic for CUID or UUID
        const isId = segment.length > 20 || /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(segment)
        
        return { title, href, isId }
      })
      .filter((item) => !item.isId)
  }, [pathname, breadcrumbsProp])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <Fragment key={item.title}>
                <BreadcrumbItem>
                  {item.href && index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink render={<Link href={item.href} />}>
                      {item.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
