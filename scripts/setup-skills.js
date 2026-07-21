import fs from 'fs';
import path from 'path';

const SKILLS_DIR = path.join(process.cwd(), '.agents/skills/crud-mastery');
const RESOURCES_DIR = path.join(SKILLS_DIR, 'resources');

function log(message) {
  console.log(`[SKILLS SETUP] ${message}`);
}

async function run() {
  log('Initializing local skills with DataTable templates...');

  if (!fs.existsSync(RESOURCES_DIR)) {
    fs.mkdirSync(RESOURCES_DIR, { recursive: true });
  }

  // 1. SKILL.md
  const skillMdContent = `---
name: crud-mastery
description: Instructions and templates for creating new CRUD features based on the project's established patterns (Prisma + Server Actions + Shadcn UI).
---

# 🛠️ CRUD Mastery: The Ultimate Guide

This skill provides a systematic approach to creating new data-driven features in this starter kit. 

## 📋 Core Workflow

1. **Schema Definition**: Add your model to \`prisma/schema.prisma\`.
2. **Validation Schema**: Create a new file in \`schemas/\` using \`schema-template.ts\`.
3. **Server Actions**: Create logic in \`app/actions/\` using \`action-template.ts\`.
4. **Column Definitions**: Define your table columns in \`components/columns/\` using \`columns-template.tsx\`.
5. **Form Component**: Build your UI form using \`form-template.tsx\`.
6. **Dashboard Page**: Assemble the feature in \`app/dashboard/\` using \`page-template.tsx\` with the \`DataTable\` component.

## 📦 Reference Templates (\`resources/\`)

- \`schema-template.ts\`: Zod validation rules + Type export.
- \`action-template.ts\`: Type-safe Server Actions.
- \`columns-template.tsx\`: TanStack Table column definitions.
- \`form-template.tsx\`: Shadcn UI form with Zod Resolver.
- \`page-template.tsx\`: Dashboard layout with \`DataTable\` integration.
`;

  fs.writeFileSync(path.join(SKILLS_DIR, 'SKILL.md'), skillMdContent);

  // 2. Schema Template
  const schemaTemplate = `import * as z from "zod";

export const ItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  published: z.boolean().default(false),
});

export type ItemValues = z.infer<typeof ItemSchema>;
`;
  fs.writeFileSync(path.join(RESOURCES_DIR, 'schema-template.ts'), schemaTemplate);

  // 3. Action Template
  const actionTemplate = `import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ItemSchema, ItemValues } from "@/schemas/your-item";

export async function createItem(values: ItemValues) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const validatedFields = ItemSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  try {
    await prisma.yourModel.create({
      data: {
        ...validatedFields.data,
        authorId: session.user.id,
      },
    });

    revalidatePath("/dashboard/your-route");
    return { success: "Created successfully!" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function deleteItem(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    await prisma.yourModel.delete({
      where: { id, authorId: session.user.id }
    });
    revalidatePath("/dashboard/your-route");
    return { success: "Deleted successfully!" };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}
`;
  fs.writeFileSync(path.join(RESOURCES_DIR, 'action-template.ts'), actionTemplate);

  // 4. Columns Template
  const columnsTemplate = `"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Item = {
  id: string;
  title: string;
  createdAt: Date | string;
};

export const getColumns = (onDelete: (id: string) => void): ColumnDef<Item>[] => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>} />
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onDelete(row.original.id)} className="text-destructive">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
`;
  fs.writeFileSync(path.join(RESOURCES_DIR, 'columns-template.tsx'), columnsTemplate);

  // 5. Form Template
  const formTemplate = `"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema, ItemValues } from "@/schemas/your-item";
import { createItem } from "@/app/actions/your-action";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ItemForm = () => {
  const form = useForm<ItemValues>({
    resolver: zodResolver(ItemSchema),
    defaultValues: { title: "", content: "", published: false },
  });

  const onSubmit = async (values: ItemValues) => {
    const res = await createItem(values);
    if (res.error) toast.error(res.error);
    if (res.success) {
      toast.success(res.success);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
`;
  fs.writeFileSync(path.join(RESOURCES_DIR, 'form-template.tsx'), formTemplate);

  // 6. Page Template
  const pageTemplate = `import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns"; // Create this file from columns-template.tsx
import { deleteItem } from "@/app/actions/your-action";
import { ItemForm } from "./item-form";

export const metadata: Metadata = {
  title: "Your Feature",
  description: "Manage your feature items here.",
};

export default async function FeaturePage() {
  const items = await prisma.yourModel.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Feature</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New</h3>
          <ItemForm />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Items</h3>
          <DataTable 
            columns={getColumns(deleteItem)} 
            data={items} 
            searchKey="title" 
          />
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(RESOURCES_DIR, 'page-template.tsx'), pageTemplate);

  log('DataTable-integrated template suite generated in .agents/skills/crud-mastery/resources/');
}

run().catch(err => {
  console.error('Skills setup failed:', err);
});
