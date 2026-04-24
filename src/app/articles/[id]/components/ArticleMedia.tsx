import Image from "next/image";
import dynamic from "next/dynamic";
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Dynamic import for Swiper to reduce initial JS
const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), { ssr: false });

interface MediaItem {
    url: string;
    type: 'image' | 'video';
}

export function ArticleMedia({ media, title }: { media: MediaItem[]; title: string }) {
    if (!media || media.length === 0) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 mb-20 relative z-10">
            <div className="rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/10 p-2">
                <div className="rounded-[2rem] overflow-hidden bg-black relative">
                    {media.length === 1 ? (
                        media[0].type === 'video' ? (
                            <video src={media[0].url} controls className="w-full max-h-[600px] object-contain mx-auto" />
                        ) : (
                            <div className="relative w-full h-[400px] md:h-[600px]">
                                <Image
                                    src={media[0].url}
                                    alt={title}
                                    fill
                                    className="object-contain mx-auto"
                                    priority
                                />
                            </div>
                        )
                    ) : (
                        <Swiper
                            modules={[Pagination, Navigation]}
                            pagination={{ clickable: true }}
                            navigation
                            className="w-full h-[400px] md:h-[600px]"
                        >
                            {media.map((item, idx) => (
                                <SwiperSlide key={idx} className="bg-black flex items-center justify-center">
                                    {item.type === 'video' ? (
                                        <video src={item.url} controls className="w-full h-full object-contain" />
                                    ) : (
                                        <Image
                                            src={item.url}
                                            alt={`Slide ${idx}`}
                                            fill
                                            className="object-contain"
                                        />
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </div>
    );
}
