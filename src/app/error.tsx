'use client';

import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center relative overflow-hidden pt-20">
                {/* Background Blobs */}
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl blob"></div>

                <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
                    <div className="glass-card border border-red-900/30 p-12 rounded-3xl shadow-2xl backdrop-blur-xl bg-slate-900/60">

                        <div className="mb-6 inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/20">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            حدث خطأ غير متوقع
                        </h2>

                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            نعتذر، واجهنا مشكلة أثناء معالجة طلبك. تم تسجيل الخطأ وسنعمل على حله.
                        </p>

                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-8 text-left dir-ltr overflow-auto max-h-32">
                            <code className="text-red-400 text-xs font-mono">
                                {error.message || "Unknown Error Interaction"}
                            </code>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={
                                    // Attempt to recover by trying to re-render the segment
                                    () => reset()
                                }
                                className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                إعادة المحاولة
                            </button>
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 hover:text-white"
                            >
                                <Home className="w-5 h-5" />
                                العودة للرئيسية
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
