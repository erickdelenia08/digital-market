// File: components/dynamic-icon.tsx
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
    name?: string | null;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
    // 1. Jika nama ikon kosong, tampilkan ikon default (Folder)
    if (!name) {
        return <Icons.Folder {...props} />;
    }

    const IconComponent = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];

    // 3. Pastikan IconComponent ada DAN merupakan komponen React valid
    if (!IconComponent || typeof IconComponent !== "object" && typeof IconComponent !== "function") {
        return <Icons.Folder {...props} />;
    }

    // 4. Render komponen ikon
    return <IconComponent {...props} />;
}