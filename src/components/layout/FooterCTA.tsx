import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FooterCTA() {
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
            
            <div className="text-center md:text-left relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Have a project in mind?</h2>
                <p className="text-slate-400 text-lg">Let&apos;s transform your idea into a highly scalable, premium digital experience. We are ready to build the next big thing.</p>
            </div>
            <div className="relative z-10 shrink-0">
                <Link href="/contact" className="group flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105">
                    Start a Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
