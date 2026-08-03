"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { useUserProfile } from "./useUserProfile";
import { UserProfileCard } from "./components/UserProfileCard";
import { UserArticlesList } from "./components/UserArticlesList";

export default function UserProfilePage() {
    const { id, user, profile, articles, loading } = useUserProfile();

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;

    if (!profile) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
            <h1 className="text-2xl font-bold">User Not Found 😕</h1>
            <Link href="/" className="text-blue-400 hover:underline">Go Home</Link>
        </div>
    );

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Header / Cover */}
            <div className="relative h-64 bg-slate-900 border-b border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
                {/* Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-32 pb-20 relative z-10">
                <UserProfileCard profile={profile} currentUser={user} profileId={id} />
                <UserArticlesList articles={articles} />
            </div>
            
            <Footer />
        </div>
    );
}
