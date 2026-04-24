import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import FeedClient from "@/components/feed/FeedClient";
import AdsSidebar from "@/components/feed/AdsSidebar";

export const metadata: Metadata = {
    title: "Explore",
    description: "Endless scrolling feed of our latest projects, articles, and useful tools.",
};

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-[#020617] relative selection:bg-blue-500/30 selection:text-blue-200 flex flex-col">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
            </div>

            {/* Navbar always on top with its own spacer */}
            <Navbar />

            {/* Page Title */}
            <div className="text-center pt-8 pb-4 px-4 relative z-10">
                <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 mb-3 tracking-tight">
                    Discover &amp; Explore
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                    Scroll through our latest projects, insights, and tools. Like, comment, and share your favorite updates.
                </p>
            </div>

            {/* 2-column layout: Feed | Ads Sidebar */}
            <div className="flex-1 relative z-10 pb-20">
                <div className="max-w-6xl mx-auto px-4 w-full">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        {/* ── Main Feed Column ─────────────────────────── */}
                        <div className="flex-1 min-w-0">
                            <FeedClient />
                        </div>

                        {/* ── Ads Sidebar Column ───────────────────────── */}
                        <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-20">
                            <AdsSidebar />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
