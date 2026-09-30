"use client";

import type { ReactNode } from "react";
import type { LeadCaptureSettings } from "@/components/leads/settings";
import type { PublicChatConfig } from "@/lib/ai/assistant/shared";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { CHROMELESS_PREFIXES } from "@/config/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ChatWidget = dynamic(() => import("@/components/chat/AiChatWidget"), { ssr: false });
const LeadCaptureModal = dynamic(() => import("@/components/leads/LeadCaptureModal"), { ssr: false });

interface SiteShellProps {
    children: ReactNode;
    /** Lead popup texts and chat widget texts, read (and cached) on the server with the page */
    leadCapture?: LeadCaptureSettings | null;
    chatConfig?: PublicChatConfig | null;
}

/**
 * The frame every public page shares: navbar, main area, footer and the chat button.
 * Pages only render their own content inside it.
 */
export default function SiteShell({ children, leadCapture, chatConfig }: SiteShellProps) {
    const pathname = usePathname();

    if (CHROMELESS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatWidget initialConfig={chatConfig} />
            <LeadCaptureModal initialSettings={leadCapture} />
        </>
    );
}
