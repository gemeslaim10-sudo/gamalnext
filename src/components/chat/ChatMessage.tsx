"use client";

import { cn } from "@/lib/utils";
import ChatMarkdown from "./ChatMarkdown";

interface ChatMessageProps {
    role: "user" | "model";
    text: string;
    isError?: boolean;
}

export default function ChatMessage({ role, text, isError }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div className={cn("flex animate-fade-in", isUser ? "justify-end" : "justify-start")}>
            <div
                dir="auto"
                className={cn(
                    "max-w-[85%] rounded-card px-3.5 py-2.5 text-sm leading-relaxed",
                    isUser
                        ? "whitespace-pre-wrap break-words bg-primary text-primary-foreground"
                        : isError
                          ? "whitespace-pre-wrap border border-danger/30 bg-danger/10 text-danger"
                          : "bg-surface-hover text-foreground"
                )}
            >
                {isUser || isError ? text : <ChatMarkdown text={text} />}
            </div>
        </div>
    );
}
