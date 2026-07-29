"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CategoryModal({ open, onOpenChange }: CategoryModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Create New Category
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input id="category-name" placeholder="e.g. Video Templates" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category-slug">Slug</Label>
                        <Input id="category-slug" placeholder="video-templates" />
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Save Category</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}