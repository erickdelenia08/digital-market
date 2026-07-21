import { Metadata } from "next"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { dashboardColumns } from "@/components/columns/dashboard"
import { SectionCards } from "@/components/section-cards"

import data from "@/data/dashboard.json"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your account and statistics",
}

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} columns={dashboardColumns} />
      </div>
    </div>
  )
}
