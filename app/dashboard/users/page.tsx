import { prisma } from "@/lib/db";
import { DataTable } from "@/components/data-table";
import { userColumns } from "@/components/columns/user-columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage system users and administrators.
          </p>
        </div>
        <Link href="/dashboard/users/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </Link>
      </div>

      <div className="bg-background border rounded-lg shadow-sm">
        <DataTable columns={userColumns} data={formattedUsers} searchKey="name" />
      </div>
    </div>
  );
}
