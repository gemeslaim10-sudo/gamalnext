"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();

    if (user) {
        router.push("/admin");
        return null;
    }

    const handleGoogleLogin = async () => {
        setError("");
        setIsSubmitting(true);
        try {
            await signInWithGoogle();
            router.push("/admin");
        } catch (err: unknown) {
            console.error(err);
            setError("Failed to sign in with Google.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
            <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
                <p className="text-slate-400 text-sm text-center mb-8">Sign in with your Google account to access admin panel</p>

                {error && (
                    <div className="p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                    className="group w-full relative overflow-hidden bg-white hover:bg-slate-50 text-slate-900 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                    ) : (
                        <>
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Sign in with Google</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
