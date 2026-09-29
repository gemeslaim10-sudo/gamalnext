"use client";

import { Search, Trash2, UserPlus } from "lucide-react";
import { formatTimestamp, getTimestampMs } from "@/types";
import { Alert, Badge, Button, Input, LoadingBlock } from "@/components/ui";
import { cn } from "@/lib/utils";
import { sessionName, sessionPhone, type ChatSessionSummary } from "./types";

interface ChatSidebarProps {
    sessions: ChatSessionSummary[];
    selectedSessionId: string | null;
    setSelectedSessionId: (id: string | null) => void;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    loading: boolean;
    error: string | null;
    onDelete: (session: ChatSessionSummary) => void;
}

export default function ChatSidebar({
    sessions,
    selectedSessionId,
    setSelectedSessionId,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    onDelete,
}: ChatSidebarProps) {
    const q = searchTerm.trim().toLowerCase();
    const filteredSessions = q
        ? sessions.filter((s) =>
              [sessionName(s), sessionPhone(s) || "", s.preview || "", s.id].some((field) => field.toLowerCase().includes(q))
          )
        : sessions;

    return (
        <div
            className={cn(
                "min-h-0 w-full flex-col lg:w-80 lg:shrink-0 lg:border-r lg:border-border",
                selectedSessionId ? "hidden lg:flex" : "flex"
            )}
        >
            <div className="shrink-0 space-y-3 border-b border-border p-4">
                <h2 className="text-sm font-semibold text-foreground">
                    Conversations <span className="font-normal text-subtle">({sessions.length})</span>
                </h2>
                <div className="relative">
                    <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                    <Input
                        type="search"
                        placeholder="Search name, phone or message…"
                        aria-label="Search conversations"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                {loading ? (
                    <LoadingBlock label="Loading chats…" className="py-10" />
                ) : error ? (
                    <div className="p-4">
                        <Alert variant="danger">{error}</Alert>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <p className="p-6 text-center text-sm text-subtle">No chats found.</p>
                ) : (
                    <ul className="divide-y divide-border">
                        {filteredSessions.map((session) => {
                            const active = selectedSessionId === session.id;
                            return (
                                <li key={session.id} className={cn("flex transition-colors hover:bg-surface-hover", active && "bg-surface-hover")}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSessionId(session.id)}
                                        aria-current={active ? "true" : undefined}
                                        className="min-w-0 flex-1 py-3 pl-4 pr-2 text-left"
                                    >
                                        <span className="flex items-baseline justify-between gap-3">
                                            <span dir="auto" className="truncate text-sm font-medium text-foreground">
                                                {sessionName(session)}
                                            </span>
                                            <span className="shrink-0 text-xs text-subtle">
                                                {getTimestampMs(session.lastMessageAt)
                                                    ? formatTimestamp(session.lastMessageAt, "en-US", {
                                                          month: "short",
                                                          day: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                          hour12: false,
                                                      })
                                                    : ""}
                                            </span>
                                        </span>
                                        <span dir="auto" className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                                            {session.preview || "Open to read the conversation"}
                                        </span>
                                        {session.lead?.phone && (
                                            <Badge variant="success" className="mt-2">
                                                <UserPlus aria-hidden /> Lead saved
                                            </Badge>
                                        )}
                                    </button>
                                    <div className="flex shrink-0 items-start py-2 pr-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(session)}
                                            aria-label="Delete conversation"
                                            title="Delete conversation"
                                            className="hover:bg-danger/10 hover:text-danger"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
