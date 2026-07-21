import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { UserForm } from "@/components/forms/user-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  const initialData = {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    role: user.role as "USER" | "ADMIN",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground mt-1">
            Update user information and role.
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg shadow-sm p-6">
        <UserForm initialData={initialData} />
      </div>
    </div>
  );
}
