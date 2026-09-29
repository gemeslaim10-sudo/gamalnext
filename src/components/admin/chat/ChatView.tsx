"use client";

import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { formatTimestamp, getTimestampMs } from "@/types";
import { Badge, Button, ButtonLink, LoadingBlock } from "@/components/ui";
import ChatMarkdown from "@/components/chat/ChatMarkdown";
import { stripLegacyTags } from "@/lib/ai/assistant/history";
import { normalizePhone } from "@/lib/leads/schema";
import { cn } from "@/lib/utils";
import { sessionName, sessionPhone, type ChatLogMessage, type ChatSessionSummary } from "./types";

/** wa.me needs the country code; local Egyptian numbers (01…) get +20. */
function whatsappLink(phone: string) {
    let digits = normalizePhone(phone).replace(/\D/g, "");
    if (/^0\d{9,10}$/.test(digits)) digits = `20${digits.slice(1)}`;
    return `https://wa.me/${digits}`;
}

interface ChatViewProps {
    session: ChatSessionSummary | undefined;
    messages: ChatLogMessage[];
    loading: boolean;
    onBack: () => void;
}

export default function ChatView({ session, messages, loading, onBack }: ChatViewProps) {
    if (!session) {
        return (
            <div className="hidden flex-1 flex-col items-center justify-center gap-1 p-6 text-center lg:flex">
                <p className="text-sm text-muted">Select a conversation to read it</p>
                <p className="text-xs text-subtle">Every chat with the site assistant is saved here automatically.</p>
            </div>
        );
    }

    const name = sessionName(session);
    const phone = sessionPhone(session);
    const started = getTimestampMs(session.startedAt)
        ? formatTimestamp(session.startedAt, "en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;

    return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border px-4 py-3">
                <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to conversations" className="-ml-2 lg:hidden">
                    <ArrowLeft />
                </Button>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-hover text-sm font-medium text-foreground"
                    >
                        {(name[0] || "V").toUpperCase()}
                    </span>
                    <div className="min-w-0">
                        <h2 dir="auto" className="truncate text-sm font-semibold text-foreground">
                            {name}
                        </h2>
                        <p className="truncate text-xs text-subtle">
                            {started ? `Started ${started}` : `ID ${session.id.slice(0, 8)}…`}
                            {session.lead?.service ? ` · ${session.lead.service}` : ""}
                        </p>
                    </div>
                </div>
                {phone && (
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={session.lead ? "success" : "neutral"}>
                            <Phone aria-hidden />
                            <span dir="ltr">{phone}</span>
                        </Badge>
                        <ButtonLink href={whatsappLink(phone)} external variant="secondary" size="sm">
                            <MessageCircle /> WhatsApp
                        </ButtonLink>
                    </div>
                )}
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
                {loading ? (
                    <LoadingBlock label="Loading messages…" />
                ) : messages.length === 0 ? (
                    <p className="py-10 text-center text-sm text-subtle">No messages in this conversation (the visitor may have cleared it).</p>
                ) : (
                    messages.map((msg) => {
                        const isUser = msg.role === "user";
                        const ms = getTimestampMs(msg.timestamp);
                        const time = ms ? new Date(ms).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }) : "";
                        const text = stripLegacyTags(msg.text).trim();
                        return (
                            <div key={msg.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                                <div
                                    className={cn(
                                        "max-w-[85%] rounded-card px-3.5 py-2.5 text-sm leading-relaxed",
                                        isUser ? "bg-primary text-primary-foreground" : "bg-surface-hover text-foreground"
                                    )}
                                >
                                    {isUser ? (
                                        <div dir="auto" className="whitespace-pre-wrap break-words">
                                            {text}
                                        </div>
                                    ) : (
                                        <ChatMarkdown text={text} />
                                    )}
                                    {time && (
                                        <div className={cn("mt-1.5 text-xs", isUser ? "text-right text-primary-foreground/60" : "text-left text-subtle")}>
                                            {time}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
