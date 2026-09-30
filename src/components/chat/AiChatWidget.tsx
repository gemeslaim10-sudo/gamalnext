"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePresence } from "@/hooks/usePresence";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useAiChat } from "./useAiChat";
import { useChatStore } from "@/store/chatStore";
import type { PublicChatConfig } from "@/lib/ai/assistant/shared";
import { OVERLAY_TRANSITION, Skeleton, Spinner } from "@/components/ui";

/** Shown only if the dashboard texts can't be loaded. */
const FALLBACK = { title: "Assistant", placeholder: "Type your message…" };

/** The only entry point to the assistant: a round button that opens a chat panel. */
export default function AiChatWidget({ initialConfig }: { initialConfig?: PublicChatConfig | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const seedConfig = useChatStore((s) => s.seedConfig);
    const { messages, input, setInput, loading, handleSubmit, clearChat, config, configStatus, welcome } = useAiChat(isOpen);
    const endRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const launcherRef = useRef<HTMLButtonElement>(null);
    const wasOpen = useRef(false);
    // Keeps the panel on screen while it animates out
    const { mounted, state } = usePresence(isOpen);

    const configLoading = configStatus === "idle" || configStatus === "loading";
    const title = config?.assistantName || (configLoading ? "" : FALLBACK.title);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, loading, isOpen]);

    // The dashboard texts come with the page, so opening the chat doesn't wait for a request
    useEffect(() => {
        if (initialConfig) seedConfig(initialConfig);
    }, [initialConfig, seedConfig]);

    // Any component can open the chat with: document.dispatchEvent(new CustomEvent("open-chat-widget"))
    useEffect(() => {
        const open = () => setIsOpen(true);
        document.addEventListener("open-chat-widget", open);
        return () => document.removeEventListener("open-chat-widget", open);
    }, []);

    // Opening moves focus into the panel (not the input, so phones don't pop up the keyboard);
    // closing gives it back to the chat button
    useEffect(() => {
        if (isOpen) panelRef.current?.focus({ preventScroll: true });
        else if (wasOpen.current) launcherRef.current?.focus({ preventScroll: true });
        wasOpen.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen]);

    const handleCopyChat = async () => {
        if (messages.length === 0) return false;
        const formatted = messages
            .filter((msg) => !msg.isError)
            .map((msg) => `${msg.role === "model" ? title || FALLBACK.title : "Me"}:\n${msg.text}\n`)
            .join("\n");
        try {
            await navigator.clipboard.writeText(formatted);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <>
            {/* The button stays mounted and fades out under the panel, so opening and closing feel like one motion */}
            <button
                ref={launcherRef}
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open chat assistant"
                aria-expanded={isOpen}
                inert={isOpen}
                data-state={isOpen ? "closed" : "open"}
                className={cn(
                    "fixed bottom-4 right-4 z-30 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-popover hover:bg-primary-hover active:scale-95 sm:bottom-6 sm:right-6",
                    OVERLAY_TRANSITION,
                    "data-[state=closed]:scale-75 data-[state=closed]:opacity-0"
                )}
            >
                <MessageCircle className="size-5" />
            </button>

            {mounted && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-label={title || "Chat assistant"}
                    tabIndex={-1}
                    data-state={state}
                    className={cn(
                        "fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] origin-bottom-right flex-col overflow-hidden rounded-t-card border border-border bg-surface shadow-popover outline-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-card",
                        OVERLAY_TRANSITION,
                        // Phones: slides up like a sheet. Wider screens: grows out of the chat button's corner.
                        "data-[state=closed]:translate-y-8 sm:data-[state=closed]:translate-y-2 sm:data-[state=closed]:scale-95 data-[state=closed]:opacity-0"
                    )}
                >
                    <ChatHeader
                        title={title}
                        subtitle={config?.subtitle || ""}
                        loading={configLoading}
                        onClose={() => setIsOpen(false)}
                        onCopyChat={handleCopyChat}
                        onClearChat={clearChat}
                    />

                    <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
                        {/* Welcome message from the dashboard */}
                        {configLoading ? (
                            <div className="flex justify-start">
                                <div className="w-3/4 space-y-2 rounded-card bg-surface-hover px-3.5 py-3">
                                    <Skeleton className="h-3 w-full bg-border" />
                                    <Skeleton className="h-3 w-2/3 bg-border" />
                                </div>
                            </div>
                        ) : (
                            welcome && <ChatMessage role="model" text={welcome} />
                        )}

                        {messages.map((msg, idx) => (
                            <ChatMessage key={idx} role={msg.role} text={msg.text} isError={msg.isError} />
                        ))}

                        {loading && (
                            <div className="flex animate-fade-in justify-start" role="status" aria-label="Typing">
                                <div className="rounded-card bg-surface-hover px-3.5 py-2.5">
                                    <Spinner className="size-4" />
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    <ChatInput
                        input={input}
                        setInput={setInput}
                        onSubmit={handleSubmit}
                        loading={loading}
                        placeholder={config?.placeholder || (configLoading ? "" : FALLBACK.placeholder)}
                    />
                </div>
            )}
        </>
    );
}
