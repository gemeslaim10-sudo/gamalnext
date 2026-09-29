"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { CHROMELESS_PREFIXES } from "@/config/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ChatWidget = dynamic(() => import("@/components/chat/AiChatWidget"), { ssr: false });
const LeadCaptureModal = dynamic(() => import("@/components/leads/LeadCaptureModal"), { ssr: false });

/**
 * The frame every public page shares: navbar, main area, footer and the chat button.
 * Pages only render their own content inside it.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    if (CHROMELESS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatWidget />
            <LeadCaptureModal />
        </>
    );
}
