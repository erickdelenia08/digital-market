"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Pencil,
    Bold,
    Italic,
    List,
    Link as LinkIcon,
    Code,
    ImagePlus,
    Plus,
    Trash2,
    Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CategoryModal } from "./category-modal"

export function EditProductForm() {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [isPublished, setIsPublished] = useState(true)
    const [isFeatured, setIsFeatured] = useState(false)

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Header Page */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Edit: Motion Pack AE v2
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">Save as Draft</Button>
                    <Button>Save Changes</Button>
                </div>
            </div>

            {/* Grid Layout 70% / 30% */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                {/* Kolom Kiri (70%) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="product-name">Product Name</Label>
                                <Input id="product-name" defaultValue="Motion Pack AE v2" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url-slug">URL Slug</Label>
                                <div className="relative">
                                    <Input
                                        id="url-slug"
                                        defaultValue="motion-pack-ae-v2"
                                        className="pr-10"
                                    />
                                    <Pencil className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                                    <div className="bg-muted/50 px-3 py-2 flex items-center gap-3 border-b">
                                        <button type="button" className="text-muted-foreground hover:text-foreground">
                                            <Bold className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="text-muted-foreground hover:text-foreground">
                                            <Italic className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="text-muted-foreground hover:text-foreground">
                                            <List className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="text-muted-foreground hover:text-foreground">
                                            <LinkIcon className="w-4 h-4" />
                                        </button>
                                        <div className="w-px h-4 bg-border" />
                                        <button type="button" className="text-muted-foreground hover:text-foreground">
                                            <Code className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <Textarea
                                        id="description"
                                        rows={6}
                                        className="border-0 focus-visible:ring-0 rounded-none resize-none"
                                        defaultValue="The Motion Pack AE v2 is a comprehensive toolkit for After Effects creators..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                                Media Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Cover Image</Label>
                                    <div className="relative group aspect-video rounded-lg overflow-hidden border">
                                        <Image
                                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"
                                            alt="Cover Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="secondary" size="sm" className="gap-2">
                                                <ImagePlus className="w-4 h-4" /> Replace Image
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Gallery Previews</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative rounded-lg overflow-hidden border aspect-video">
                                            <Image
                                                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"
                                                alt="Cover Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="relative rounded-lg overflow-hidden border aspect-video">
                                            <Image
                                                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"
                                                alt="Cover Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors aspect-video text-muted-foreground hover:text-foreground">
                                            <Plus className="w-6 h-6" />
                                            <span className="text-xs font-medium mt-1">
                                                + Upload Preview
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Digital Assets */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-xl font-semibold">
                                Digital Assets
                            </CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" className="gap-1">
                                    <Plus className="w-4 h-4" /> Upload New File (.zip, .pdf)
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1">
                                    <LinkIcon className="w-4 h-4" /> Add External Link
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium leading-none">
                                                motion-pack-v2-final.zip
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-100 text-green-800 text-[10px] font-semibold border-none"
                                            >
                                                Uploaded
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">120 MB</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan (30%) */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (IDR)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                        Rp
                                    </span>
                                    <Input id="price" defaultValue="150.000" className="pl-9" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organization */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Organization
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select defaultValue="source-code">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="source-code">Source Code</SelectItem>
                                        <SelectItem value="figma">Figma</SelectItem>
                                        <SelectItem value="e-book">E-Book</SelectItem>
                                    </SelectContent>
                                </Select>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    className="text-primary text-xs font-medium flex items-center gap-1 hover:underline mt-1"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add New Category
                                </button>
                            </div>

                            <div className="space-y-4 pt-2 border-t">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="published-status" className="cursor-pointer">
                                        Published Status
                                    </Label>
                                    <Switch
                                        id="published-status"
                                        checked={isPublished}
                                        onCheckedChange={setIsPublished}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="featured-product" className="cursor-pointer">
                                        Featured Product
                                    </Label>
                                    <Checkbox
                                        id="featured-product"
                                        checked={isFeatured}
                                        onCheckedChange={(checked) => setIsFeatured(!!checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metrics (khusus untk products/edit)*/}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted/40 p-3 rounded-lg border space-y-3">
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span className="text-xs">Total Sales</span>
                                    <span className="text-xs font-semibold text-foreground">
                                        142
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span className="text-xs">Average Rating</span>
                                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                                        4.8 / 5.0{" "}
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modal Dialog Component */}
            <CategoryModal
                open={isCategoryModalOpen}
                onOpenChange={setIsCategoryModalOpen}
            />
        </div>
    )
}