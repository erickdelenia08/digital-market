import { UserForm } from "@/components/forms/user-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateUserPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
          <p className="text-muted-foreground mt-1">
            Add a new user or administrator to the system.
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg shadow-sm p-6">
        <UserForm />
      </div>
    </div>
  );
}
