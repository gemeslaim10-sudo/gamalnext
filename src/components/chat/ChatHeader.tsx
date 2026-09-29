"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Trash2, X } from "lucide-react";
import { Button, Skeleton } from "@/components/ui";

interface ChatHeaderProps {
    title: string;
    subtitle: string;
    /** Shows placeholders until the texts from the dashboard arrive */
    loading?: boolean;
    onClose?: () => void;
    /** Returns true when something was copied */
    onCopyChat?: () => Promise<boolean>;
    onClearChat?: () => void;
}

export default function ChatHeader({ title, subtitle, loading, onClose, onCopyChat, onClearChat }: ChatHeaderProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return undefined;
        const timer = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(timer);
    }, [copied]);

    return (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0 flex-1">
                {loading ? (
                    <div className="space-y-1.5 py-0.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-44 max-w-full" />
                    </div>
                ) : (
                    <>
                        <p dir="auto" className="truncate text-sm font-semibold text-foreground">
                            {title}
                        </p>
                        {subtitle && (
                            <p dir="auto" className="truncate text-xs text-subtle">
                                {subtitle}
                            </p>
                        )}
                    </>
                )}
            </div>
            <div className="flex items-center gap-1">
                {onCopyChat && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={async () => setCopied(await onCopyChat())}
                        aria-label={copied ? "Copied" : "Copy chat"}
                        title="Copy chat"
                    >
                        {copied ? <Check /> : <Copy />}
                    </Button>
                )}
                {onClearChat && (
                    <Button variant="ghost" size="icon-sm" onClick={onClearChat} aria-label="Clear chat" title="Clear chat">
                        <Trash2 />
                    </Button>
                )}
                {onClose && (
                    <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close chat" title="Close chat">
                        <X />
                    </Button>
                )}
            </div>
        </div>
    );
}
