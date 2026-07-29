import { Metadata } from "next"
import { ChartAreaInteractive, ChartDataPoint } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { dashboardColumns, OrderColumnData } from "@/components/columns/dashboard"
import { SectionCards } from "@/components/section-cards"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your account and statistics",
}

export default async function DashboardPage() {
  // Fetch SectionCards data
  const totalUsers = await prisma.user.count();
  
  // Calculate total revenue
  const orders = await prisma.order.findMany({
    where: {
      status: 'COMPLETED'
    },
    include: {
      user: true
    }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Chart data (Group revenue by date)
  const revenueByDate: Record<string, number> = {};
  orders.forEach((order) => {
    const dateStr = order.createdAt.toISOString().split('T')[0];
    revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + order.totalAmount;
  });

  const chartData: ChartDataPoint[] = Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    revenue
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Table Data (Latest 20 orders)
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: true
    }
  });

  const tableData: OrderColumnData[] = recentOrders.map(order => ({
    id: order.id,
    customerName: order.user?.name || 'Unknown User',
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt
  }));

  // Dummy stats for demo based on actual totals
  const newCustomers = totalUsers > 0 ? Math.max(1, Math.floor(totalUsers * 0.1)) : 0;
  const growthRate = totalRevenue > 0 ? 12.5 : 0; // Positive growth if revenue > 0

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards 
          totalRevenue={totalRevenue} 
          newCustomers={newCustomers} 
          activeAccounts={totalUsers} 
          growthRate={growthRate} 
        />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive chartData={chartData} />
        </div>
        <DataTable data={tableData} columns={dashboardColumns} searchKey="customerName" />
      </div>
    </div>
  )
}
