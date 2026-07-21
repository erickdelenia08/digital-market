"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { 
  createUserSchema, 
  updateUserSchema, 
  CreateUserInput, 
  UpdateUserInput 
} from "@/schemas/user-schema";
import { createUser, updateUser } from "@/app/actions/user-actions";

interface UserFormProps {
  initialData?: (UpdateUserInput & { id: string }) | null;
}

export function UserForm({ initialData }: UserFormProps = {}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use appropriate schema based on edit vs create mode
  const schema = initialData ? updateUserSchema : createUserSchema;

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(schema) as unknown as Resolver<UpdateUserInput>,
    defaultValues: initialData || {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  async function onSubmit(data: UpdateUserInput) {
    setIsSubmitting(true);
    let res;

    if (initialData) {
      res = await updateUser(initialData.id, data);
    } else {
      res = await createUser(data as CreateUserInput);
    }

    setIsSubmitting(false);

    if (res.success && res.data) {
      toast.success(initialData ? "User updated successfully!" : "User created successfully!");
      if (!initialData) {
        // Create & Redirect pattern
        router.push(`/dashboard/users/${res.data.id}/edit`);
      }
    } else {
      toast.error(res.error || (initialData ? "Failed to update user" : "Failed to create user"));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password {initialData && "(Optional)"}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                {initialData && (
                  <FormDescription>
                    Leave blank to keep the current password.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create User"}
        </Button>
      </form>
    </Form>
  );
}
