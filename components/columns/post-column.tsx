"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

// Menyesuaikan tipe data dengan hasil mapping di PostsPage
export type PostColumn = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    published: boolean;
    publishedAt: Date | null;
    viewsCount: number;
    author: {
        name: string;
    };
    category: {
        name: string;
    } | null;
    createdAt: Date;
};

export const postColumns: ColumnDef<PostColumn>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category;
            return <span>{category ? category.name : "Uncategorized"}</span>;
        },
    },
    {
        accessorKey: "author.name",
        header: "Author",
    },
    {
        accessorKey: "viewsCount",
        header: "Views",
        cell: ({ row }) => {
            const views = row.getValue("viewsCount") as number;
            return (
                <div className="flex items-center text-muted-foreground">
                    <Eye className="mr-2 h-4 w-4" />
                    {views}
                </div>
            );
        },
    },
    {
        accessorKey: "published",
        header: "Status",
        cell: ({ row }) => {
            const isPublished = row.getValue("published") as boolean;
            return (
                <Badge variant={isPublished ? "default" : "secondary"}>
                    {isPublished ? "Published" : "Draft"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as Date;
            return <DateCell date={date} />;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const post = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>}>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(post.id)}
                            >
                                Copy post ID
                            </DropdownMenuItem>
                            {/* Tambahan opsional: Copy URL Blog */}
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(`https://domainkamu.com/blog/${post.slug}`)}
                            >
                                Copy article link
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href={`/dashboard/posts/${post.id}/edit`}>
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

// Komponen pembungkus untuk mencegah Hydration Error pada formatting Date
const DateCell = ({ date }: { date: Date }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Format tanggal: "26 Jul 2026"
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));

    return (
        <div className="text-sm text-muted-foreground">
            {isClient ? formattedDate : "Loading..."}
        </div>
    );
};