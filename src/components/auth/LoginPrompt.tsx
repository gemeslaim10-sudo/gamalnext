"use client";

import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export function LoginPrompt({ 
    title = "Authentication Required", 
    description = "Please sign in to access this page." 
}: { 
    title?: string; 
    description?: string; 
}) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <>
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
                <div className="relative z-10 flex flex-col items-center max-w-lg text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 rotate-12">
                        <span className="text-4xl -rotate-12">🔐</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        {title}
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                        {description}
                    </p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="group relative bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10">Sign In / Create Account</span>
                        <svg className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
