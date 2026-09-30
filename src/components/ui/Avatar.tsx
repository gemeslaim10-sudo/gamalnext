import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { cloudinaryLoader, isCloudinaryImage } from "@/lib/cloudinary-loader";

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
                // Cloudinary photos come straight from Cloudinary at twice the display size (sharp on retina screens)
                isCloudinaryImage(src) ? (
                    <Image src={cloudinaryLoader({ src, width: size * 2 })} alt={alt} fill unoptimized className="object-cover" priority={priority} />
                ) : (
                    <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" priority={priority} />
                )
            ) : (
                <User aria-hidden style={{ width: size * 0.5, height: size * 0.5 }} />
            )}
        </span>
    );
}
