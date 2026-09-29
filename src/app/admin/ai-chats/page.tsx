"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, limit, getDocs, writeBatch } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import ChatSidebar from "@/components/admin/chat/ChatSidebar";
import ChatView from "@/components/admin/chat/ChatView";
import { sessionName, type ChatLogMessage, type ChatSessionSummary } from "@/components/admin/chat/types";
import { Button, Card, Modal, PageHeader } from "@/components/ui";

export default function AiChatsPage() {
    const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ sessionId: string; items: ChatLogMessage[] } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // The dialog keeps its target while it animates closed
    const [deleting, setDeleting] = useState<{ open: boolean; session: ChatSessionSummary | null }>({ open: false, session: null });
    const [deletingBusy, setDeletingBusy] = useState(false);
    const closeDelete = useCallback(() => setDeleting((d) => ({ ...d, open: false })), []);

    // Conversations, newest first (live)
    useEffect(() => {
        const q = query(collection(db, "chat_sessions"), orderBy("lastMessageAt", "desc"), limit(50));
        return onSnapshot(
            q,
            (snapshot) => {
                setSessions(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatSessionSummary));
                setLoading(false);
            },
            (err) => {
                console.error("Firestore listen error:", err);
                setError(err.code === "permission-denied" ? "Missing permissions. Make sure the Firestore rules are deployed." : "Could not load conversations.");
                setLoading(false);
            }
        );
    }, []);

    // Messages of the open conversation (live)
    useEffect(() => {
        if (!selectedSessionId) return undefined;
        const q = query(collection(db, "chat_sessions", selectedSessionId, "messages"), orderBy("timestamp", "asc"));
        return onSnapshot(
            q,
            (snapshot) =>
                setMessages({
                    sessionId: selectedSessionId,
                    items: snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatLogMessage),
                }),
            (err) => {
                console.error("Messages listen error:", err);
                setMessages({ sessionId: selectedSessionId, items: [] });
            }
        );
    }, [selectedSessionId]);

    const handleDelete = async () => {
        const target = deleting.session;
        if (!target) return;
        setDeletingBusy(true);
        try {
            // A document's subcollection isn't removed with it, so the messages go first
            const snapshot = await getDocs(collection(db, "chat_sessions", target.id, "messages"));
            const docs = snapshot.docs;
            for (let i = 0; i < docs.length; i += 400) {
                const batch = writeBatch(db);
                docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
                await batch.commit();
            }
            const batch = writeBatch(db);
            batch.delete(doc(db, "chat_sessions", target.id));
            await batch.commit();
            if (selectedSessionId === target.id) setSelectedSessionId(null);
            closeDelete();
            toast.success("Conversation deleted");
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Could not delete the conversation");
        } finally {
            setDeletingBusy(false);
        }
    };

    const activeSession = sessions.find((s) => s.id === selectedSessionId);
    const activeMessages = messages && messages.sessionId === selectedSessionId ? messages.items : [];
    const messagesLoading = !!selectedSessionId && messages?.sessionId !== selectedSessionId;

    return (
        <>
            <PageHeader title="AI Chat Logs" description="Conversations visitors had with the site assistant." />

            {/* Fills the rest of the screen: list + conversation side by side on large screens, one at a time on smaller ones */}
            <Card padding="none" className="flex h-[calc(100dvh-15rem)] min-h-[26rem] overflow-hidden lg:h-[calc(100dvh-11.5rem)]">
                <ChatSidebar
                    sessions={sessions}
                    selectedSessionId={selectedSessionId}
                    setSelectedSessionId={setSelectedSessionId}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    loading={loading}
                    error={error}
                    onDelete={(session) => setDeleting({ open: true, session })}
                />

                <ChatView session={activeSession} messages={activeMessages} loading={messagesLoading} onBack={() => setSelectedSessionId(null)} />
            </Card>

            <Modal open={deleting.open} onClose={() => !deletingBusy && closeDelete()} title="Delete this conversation?" size="sm">
                <div className="space-y-4 p-5">
                    <p className="text-sm text-muted">
                        The conversation with{" "}
                        <span dir="auto" className="font-medium text-foreground">
                            {deleting.session ? sessionName(deleting.session) : ""}
                        </span>{" "}
                        and all its messages will be deleted permanently. Saved leads are not affected.
                    </p>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="secondary" onClick={closeDelete} disabled={deletingBusy}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete} disabled={deletingBusy}>
                            {deletingBusy ? "Deleting…" : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
