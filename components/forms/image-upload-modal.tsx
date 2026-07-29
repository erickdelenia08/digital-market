import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload } from "lucide-react";

interface Props {
    onInsertImage: (url: string) => void;
}

export const ImageUploadModal = ({ onInsertImage }: Props) => {
    const [open, setOpen] = useState(false);
    const [urlInput, setUrlInput] = useState("");

    // Handler Upload Local
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;

                // Simpan ke LocalStorage contoh saja
                localStorage.setItem(`img_${Date.now()}`, base64);

                // Insert ke editor & tutup modal
                onInsertImage(base64);
                setOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handler Insert via URL
    const handleUrlSubmit = () => {
        if (urlInput) {
            onInsertImage(urlInput);
            setUrlInput("");
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                    <ImageIcon className="h-4 w-4" />
                </Button>
            }>

            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Insert Gambar</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Opsi 1: Upload File */}
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition">
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm font-medium">Upload dari perangkat</span>
                            <span className="text-xs text-muted-foreground">PNG, JPG, WEBP hingga 5MB</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>

                    <div className="relative text-center text-xs uppercase after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">Atau via URL</span>
                    </div>

                    {/* Opsi 2: URL Input */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="https://example.com/image.jpg"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                        />
                        <Button onClick={handleUrlSubmit}>Insert</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};