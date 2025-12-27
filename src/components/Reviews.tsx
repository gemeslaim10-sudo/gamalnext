"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Reveal from "./Reveal";
import AddReview from "./AddReview";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Star, Quote, User } from "lucide-react";

type Review = {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: any;
}

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const q = query(collection(db, "reviews"), where("status", "==", "approved"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
            setReviews(data);
        });
        return () => unsubscribe();
    }, []);

    return (
        <section id="reviews" className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <Reveal className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">آراء العملاء</h2>
                    <p className="text-slate-400">ماذا يقول الناس عن العمل معي</p>
                </Reveal>

                {reviews.length > 0 ? (
                    <div className="mb-20">
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="pb-12"
                        >
                            {reviews.map((review) => (
                                <SwiperSlide key={review.id}>
                                    <div className="glass-card p-8 rounded-3xl h-full flex flex-col relative group hover:border-blue-500/30 transition-all duration-300">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-tr-3xl"></div>
                                        <Quote className="absolute top-8 right-8 w-10 h-10 text-slate-700/50 group-hover:text-blue-500/20 transition-colors" />

                                        <div className="flex gap-1 mb-6 relative z-10">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'text-slate-800'}`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-slate-300 mb-8 flex-grow leading-relaxed text-sm md:text-base relative z-10 font-light">
                                            "{review.comment}"
                                        </p>

                                        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-800/50 relative z-10">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center border border-slate-600 shadow-lg group-hover:border-blue-500/50 transition-colors">
                                                <User className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">{review.userName}</h4>
                                                <span className="text-slate-500 text-xs flex items-center gap-1">
                                                    Verified Client <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 mb-16">
                        <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}

                <Reveal className="stagger-1">
                    <AddReview />
                </Reveal>
            </div>
        </section>
    );
}
