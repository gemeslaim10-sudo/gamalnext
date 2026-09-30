"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAdminDoc } from "@/components/admin/kit";
import { AI_KNOWLEDGE_DOC, sanitizeCards, type KnowledgeCard } from "@/lib/ai/assistant/shared";

const KNOWLEDGE_PATH = `${AI_KNOWLEDGE_DOC.collection}/${AI_KNOWLEDGE_DOC.id}` as const;

const normalizeKnowledge = (raw: Record<string, unknown> | null) => sanitizeCards(raw?.cards);

/** Firestore rejects `undefined` values, so optional fields are left out when empty. */
function toFirestore(card: KnowledgeCard) {
    return {
        id: card.id,
        title: card.title,
        category: card.category,
        content: card.content,
        tags: card.tags,
        active: card.active,
        pinned: card.pinned,
        ...(card.createdAt ? { createdAt: card.createdAt } : {}),
        ...(card.updatedAt ? { updatedAt: card.updatedAt } : {}),
    };
}

/**
 * `settings/ai_knowledge` ({ cards, updatedAt }), read once per visit. Every change writes the
 * `cards` array built from that copy — which updates the copy too, so nothing is read again — and
 * refreshes the assistant right away. Changes run one at a time (`busy`).
 */
export function useKnowledge() {
    const doc = useAdminDoc(KNOWLEDGE_PATH, normalizeKnowledge);
    const [busyId, setBusyId] = useState<string | null>(null);

    const commit = async (id: string, change: (list: KnowledgeCard[]) => KnowledgeCard[], success?: string) => {
        if (!doc.data) return false;
        setBusyId(id);
        try {
            await doc.save({ cards: change(doc.data).map(toFirestore) }, { refresh: ["ai"] });
            if (success) toast.success(success);
            return true;
        } catch (error) {
            console.error("Saving the knowledge base failed:", error);
            toast.error("ماقدرناش نحفظ. اتأكد من الاتصال وجرّب تاني.");
            return false;
        } finally {
            setBusyId(null);
        }
    };

    const saveCard = (card: KnowledgeCard) => {
        const now = Date.now();
        const stamped = { ...card, createdAt: card.createdAt || now, updatedAt: now };
        return commit(
            card.id,
            (list) => (list.some((c) => c.id === card.id) ? list.map((c) => (c.id === card.id ? stamped : c)) : [...list, stamped]),
            "اتحفظت البطاقة"
        );
    };

    const deleteCard = (id: string) => commit(id, (list) => list.filter((c) => c.id !== id), "اتمسحت البطاقة");

    const toggle = (id: string, field: "active" | "pinned") =>
        commit(id, (list) => list.map((c) => (c.id === id ? { ...c, [field]: !c[field], updatedAt: Date.now() } : c)));

    return { doc, cards: doc.data, busyId, busy: busyId !== null, saveCard, deleteCard, toggle };
}
