import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import FeedClient from "@/components/feed/FeedClient";
import AdsSidebar from "@/components/feed/AdsSidebar";
import OwnerProfile from "@/components/feed/OwnerProfile";
import InlineChatWidget from "@/components/chat/InlineChatWidget";

export const metadata: Metadata = {
    title: "Home",
    description: "Endless scrolling feed of our latest projects, articles, and useful tools.",
};

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#020617] relative selection:bg-blue-500/30 selection:text-blue-200 flex flex-col">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
            </div>

            {/* Navbar always on top with its own spacer */}
            <Navbar />



            {/* 3-column layout: Owner Profile | Feed | Ads Sidebar */}
            <div className="flex-1 relative z-10 pb-20 pt-8">
                <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start justify-center">

                        {/* ── Col 1: Owner Profile (Priority 4) ────────── */}
                        <div className="hidden 2xl:block w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar order-1">
                            <OwnerProfile />
                        </div>

                        {/* ── Col 2: Main Feed (Priority 1) ──────────────── */}
                        <div className="flex-1 min-w-0 max-w-2xl order-2 w-full">
                            <FeedClient />
                        </div>

                        {/* ── Col 3: Ads Sidebar (Priority 3) ────────────── */}
                        <div className="hidden lg:block w-72 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar order-3">
                            <AdsSidebar />
                        </div>

                        {/* ── Col 4: AI Chat (Priority 2) ────────────────── */}
                        <div className="hidden xl:block w-80 shrink-0 sticky top-24 order-4">
                            <InlineChatWidget />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
