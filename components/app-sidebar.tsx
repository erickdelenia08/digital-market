"use client"

import { type ComponentProps } from "react"
import Link from "next/link"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ArrowLeftRight, LayoutDashboardIcon, ListIcon, NotebookPen, Settings2Icon, UsersRound } from "lucide-react"
import { Logo } from "@/components/logo"
import { useSession } from "next-auth/react"

function SidebarLogo() {
  const { state } = useSidebar()
  return <Logo size="sm" label="Acme Inc." withText={false} iconOnly={state === "collapsed"} />
}

const data = {
  navMain: [
    {
      title: "Platform",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <LayoutDashboardIcon />,
        },
        {
          title: "Products",
          url: "/dashboard/products",
          icon: <ListIcon />,
        },
        {
          title: "Article",
          url: "/dashboard/posts",
          icon: <NotebookPen />,
        },
      ],
    },
    {
      title: "Admin",
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
          icon: <UsersRound />,
        },
        {
          title: "Orders",
          url: "/dashboard/orders",
          icon: <ArrowLeftRight />,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings2Icon />,
    },
    // {
    //   title: "Add Menu",
    //   url: "#",
    //   icon: <ListIcon />,
    // },
  ],
  documents: [],
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
  }

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href="/">
                  <SidebarLogo />
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
