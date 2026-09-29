"use client";

import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import { cn } from "@/lib/utils";

const LINK = "font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground";

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
    a: ({ href, children }) => {
        if (href?.startsWith("/") && !href.startsWith("//")) {
            return (
                <Link href={href} className={LINK}>
                    {children}
                </Link>
            );
        }
        return (
            <a href={href} className={LINK} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    },
};

export default function ChatMarkdown({ text, className }: { text: string; className?: string }) {
    return (
        <div className={cn("space-y-2 break-words [&_ol]:my-1 [&_ul]:my-1", className)}>
            <ReactMarkdown components={components}>{text}</ReactMarkdown>
        </div>
    );
}
