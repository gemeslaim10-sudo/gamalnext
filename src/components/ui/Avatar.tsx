import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
    src?: string | null;
    alt: string;
    /** Rendered size in pixels */
    size?: number;
    className?: string;
    priority?: boolean;
}

export function Avatar({ src, alt, size = 40, className, priority }: AvatarProps) {
    return (
        <span
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-hover text-subtle",
                className
            )}
            style={{ width: size, height: size }}
        >
            {src ? (
                <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" priority={priority} />
            ) : (
                <User aria-hidden style={{ width: size * 0.5, height: size * 0.5 }} />
            )}
        </span>
    );
}
