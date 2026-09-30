"use client";

import { createContext, useContext, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LINK = "font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground";

/** Called when a reply's link opens a page of this site, so the chat can close and show that page. */
export const ChatNavigationContext = createContext<(() => void) | null>(null);

const SITE_HOST = new URL(SITE_URL).host.replace(/^www\./, "");

/** "/pricing" or a full link to this site → the path to open; anything else is external. */
function sitePath(href: string): string | null {
    if (href.startsWith("/") && !href.startsWith("//")) return href;
    try {
        const url = new URL(href);
        const host = url.host.replace(/^www\./, "");
        const here = typeof window === "undefined" ? "" : window.location.host;
        if (host === SITE_HOST || (here && url.host === here)) return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        // Not a full address (mailto:, tel: or a typo): leave it as it is
    }
    return null;
}

function ChatLink({ href = "", children }: { href?: string; children: ReactNode }) {
    const onNavigate = useContext(ChatNavigationContext);
    const path = sitePath(href);
    if (!path) {
        return (
            <a href={href} className={LINK} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }
    // A plain click opens the page here and closes the chat; ctrl/⌘-click still opens a new tab
    const onClick = (e: MouseEvent) => {
        if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) onNavigate?.();
    };
    return (
        <Link href={path} onClick={onClick} className={LINK}>
            {children}
        </Link>
    );
}

/** Light markdown for assistant replies: paragraphs, bold, lists, links. Raw HTML is never rendered. */
const components: Components = {
    p: ({ children }) => <p dir="auto">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    ul: ({ children }) => <ul dir="auto" className="list-disc space-y-1 ps-5">{children}</ul>,
    ol: ({ children }) => <ol dir="auto" className="list-decimal space-y-1 ps-5">{children}</ol>,
    li: ({ children }) => <li dir="auto">{children}</li>,
    // Headings from the model are shown as bold lines, keeping the bubble compact
    h1: ({ children }) => <p className="font-semibold text-foreground">{children}</p>,
    h2: ({ children }) => <p className="font-semibold text-foreground">{children}</p>,
    h3: ({ children }) => <p className="font-semibold text-foreground">{children}</p>,
    h4: ({ children }) => <p className="font-semibold text-foreground">{children}</p>,
    code: ({ children }) => <code className="rounded-control bg-surface px-1 py-0.5 font-mono text-[13px]">{children}</code>,
    pre: ({ children }) => (
        <pre dir="ltr" className="overflow-x-auto rounded-control border border-border bg-surface p-3 text-[13px] [&>code]:bg-transparent [&>code]:p-0">
            {children}
        </pre>
    ),
    hr: () => <hr className="border-border" />,
    img: () => null,
    a: ({ href, children }) => <ChatLink href={href}>{children}</ChatLink>,
};

export default function ChatMarkdown({ text, className }: { text: string; className?: string }) {
    return (
        <div className={cn("space-y-2 break-words [&_ol]:my-1 [&_ul]:my-1", className)}>
            <ReactMarkdown components={components}>{text}</ReactMarkdown>
        </div>
    );
}
