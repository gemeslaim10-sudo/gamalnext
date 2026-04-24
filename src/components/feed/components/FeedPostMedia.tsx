import Image from "next/image";
import Link from "next/link";
import { ExternalLink, PlayCircle } from "lucide-react";
import type { FeedItem } from "../types";

interface FeedPostMediaProps {
    item: FeedItem;
    index: number;
    onOpenLightbox: (images: string[], index: number, title: string) => void;
}

export function FeedPostMedia({ item, index, onOpenLightbox }: FeedPostMediaProps) {
    if (item.gallery && item.gallery.length > 1) {
        return (
            <div className={`grid gap-1 ${item.gallery.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {item.gallery.slice(0, 3).map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => onOpenLightbox(item.gallery!, idx, item.title)}
                        className={`block relative bg-black ${item.gallery!.length === 3 && idx === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'} overflow-hidden group cursor-zoom-in`}
                    >
                        <div className="absolute inset-0 bg-black/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                        </div>
                        <Image
                            src={img}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 672px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority={index === 0 && idx === 0}
                        />
                    </button>
                ))}
            </div>
        );
    }

    if (item.imageUrl) {
        return (
            <button
                onClick={() => onOpenLightbox(item.imageUrl ? [item.imageUrl] : [], 0, item.title)}
                className="block relative bg-black aspect-video w-full overflow-hidden group cursor-zoom-in"
            >
                <div className="absolute inset-0 bg-black/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {item.mediaType === "video" && item.videoUrl ? (
                        <PlayCircle className="w-16 h-16 text-white drop-shadow-2xl" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    )}
                </div>
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                />
            </button>
        );
    }

    return (
        <Link href={item.link} className="block w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 text-center hover:bg-slate-800/40 transition-colors border-y border-white/5">
            <span className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                Read Full Post <ExternalLink className="w-4 h-4" />
            </span>
        </Link>
    );
}
