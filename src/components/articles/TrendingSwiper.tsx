import { MoveRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ArticleCard from "./ArticleCard";
import type { ArticleSerialized } from "@/types";

export function TrendingSwiper({ articles }: { articles: ArticleSerialized[] }) {
    return (
        <div className="mb-20 px-2 lg:px-0 relative group/swiper">
            <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                dir="ltr"
                observer={true}
                observeParents={true}
                spaceBetween={16}
                slidesPerView={2}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{ 
                    clickable: true, 
                    dynamicBullets: true,
                }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                breakpoints={{
                    480: { slidesPerView: 2, spaceBetween: 16 },
                    768: { slidesPerView: 3, spaceBetween: 24 },
                    1024: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="trending-swiper w-full overflow-hidden !pb-20 !pt-4 [&_.swiper-pagination-bullet-active]:bg-yellow-500 [&_.swiper-pagination-bullet-active]:scale-125 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300"
            >
                {articles.map((article) => (
                    <SwiperSlide key={article.id} className="!h-auto">
                        <ArticleCard article={article} />
                    </SwiperSlide>
                ))}
            </Swiper>
            
            <div className="hidden lg:block">
                <button className="swiper-button-prev-custom absolute top-1/2 -left-4 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:border-yellow-500 hover:text-yellow-500 transition-all shadow-xl backdrop-blur-md opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:translate-x-0 -translate-x-4">
                    <MoveRight className="w-6 h-6 rotate-180" />
                </button>
                <button className="swiper-button-next-custom absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:border-yellow-500 hover:text-yellow-500 transition-all shadow-xl backdrop-blur-md opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:translate-x-0 translate-x-4">
                    <MoveRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
