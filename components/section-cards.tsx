"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"

export interface SectionCardsProps {
  totalRevenue: number;
  newCustomers: number;
  activeAccounts: number;
  growthRate: number;
}

export function SectionCards({ 
  totalRevenue = 0, 
  newCustomers = 0, 
  activeAccounts = 0, 
  growthRate = 0 
}: Partial<SectionCardsProps>) {
  const formattedRevenue = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  const getTrendIcon = (rate: number) => {
    if (rate > 0) return <TrendingUpIcon />;
    if (rate < 0) return <TrendingDownIcon />;
    return <MinusIcon />;
  };

  const getTrendColor = (rate: number) => {
    if (rate > 0) return "text-green-600 border-green-200 bg-green-50";
    if (rate < 0) return "text-red-600 border-red-200 bg-red-50";
    return "text-muted-foreground border-border bg-muted/50";
  };

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formattedRevenue}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={getTrendColor(growthRate)}>
              {getTrendIcon(growthRate)}
              {growthRate > 0 ? "+" : ""}{growthRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {growthRate > 0 ? "Trending up" : growthRate < 0 ? "Trending down" : "No trend"} this month{" "}
            {growthRate > 0 ? <TrendingUpIcon className="size-4" /> : growthRate < 0 ? <TrendingDownIcon className="size-4" /> : <MinusIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Revenue for the last 30 days
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("id-ID").format(newCustomers)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={newCustomers > 0 ? "text-green-600 border-green-200 bg-green-50" : "text-muted-foreground border-border bg-muted/50"}>
              {newCustomers > 0 ? <TrendingUpIcon /> : <MinusIcon />}
              {newCustomers > 0 ? "+10%" : "0%"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {newCustomers > 0 ? "Growing user base" : "No new customers yet"}{" "}
            {newCustomers > 0 && <TrendingUpIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Acquisition this month
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("id-ID").format(activeAccounts)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={activeAccounts > 0 ? "text-blue-600 border-blue-200 bg-blue-50" : "text-muted-foreground border-border bg-muted/50"}>
              {activeAccounts > 0 ? <TrendingUpIcon /> : <MinusIcon />}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activeAccounts > 0 ? "Strong user retention" : "No active accounts"}{" "}
            {activeAccounts > 0 && <TrendingUpIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">Total registered users</div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {growthRate}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={getTrendColor(growthRate)}>
              {getTrendIcon(growthRate)}
              {growthRate > 0 ? "+" : ""}{growthRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {growthRate > 0 ? "Steady performance increase" : growthRate < 0 ? "Performance decrease" : "Stable performance"}{" "}
            {growthRate > 0 ? <TrendingUpIcon className="size-4" /> : growthRate < 0 ? <TrendingDownIcon className="size-4" /> : <MinusIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">Monthly growth projection</div>
        </CardFooter>
      </Card>
    </div>
  )
}
