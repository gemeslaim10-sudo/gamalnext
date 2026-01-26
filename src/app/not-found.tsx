'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileQuestion, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center relative overflow-hidden pt-20">
                {/* Background Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl blob animation-delay-2000"></div>

                <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
                    <div className="glass-card border border-slate-800 p-12 rounded-3xl shadow-2xl backdrop-blur-xl">

                        <div className="mb-8 relative inline-block">
                            <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-sm transform scale-150">
                                404
                            </div>
                            <div className="relative z-10 bg-slate-900/50 p-6 rounded-full border border-slate-700 inline-flex mb-4">
                                <FileQuestion className="w-16 h-16 text-blue-500" />
                            </div>
                            <h1 className="text-6xl font-black text-white mb-2 tracking-tight">404</h1>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            عذراً، المحتوى المطلوب غير متاح
                        </h2>

                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            نعتذر، لم يتم العثور على الصفحة المطلوبة ضمن النطاق الحالي، أو ربما تم تغيير مسار الوصول.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                            >
                                <Home className="w-5 h-5" />
                                الانتقال للصفحة الرئيسية
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 hover:text-white"
                            >
                                <ArrowRight className="w-5 h-5" />
                                العودة للصفحة السابقة
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
