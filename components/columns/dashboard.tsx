"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CircleCheckIcon, ClockIcon, XCircleIcon, CheckCircle2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useIsMobile } from "@/hooks/use-mobile"

export type OrderColumnData = {
  id: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: Date
}

export const dashboardColumns: ColumnDef<OrderColumnData, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.original.id;
      return <span className="text-sm font-medium">{id.slice(0, 8).toUpperCase()}</span>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.customerName}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(row.original.createdAt))}
        </span>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "COMPLETED" ? "default" : status === "CANCELLED" ? "destructive" : "outline"} className="px-1.5 flex w-fit gap-1 items-center">
          {status === "COMPLETED" ? (
            <CheckCircle2Icon className="w-3 h-3" />
          ) : status === "PENDING" ? (
            <ClockIcon className="w-3 h-3" />
          ) : (
            <XCircleIcon className="w-3 h-3" />
          )}
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.totalAmount.toString())
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)

      return <div className="font-medium" suppressHydrationWarning>{formatted}</div>
    },
  },
]
