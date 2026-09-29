import { useEffect, useState } from "react";
import { doc, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { AI_KNOWLEDGE_DOC, sanitizeCards, type KnowledgeCard } from "@/lib/ai/assistant/shared";

const knowledgeRef = () => doc(db, AI_KNOWLEDGE_DOC.collection, AI_KNOWLEDGE_DOC.id);

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
 * Live view of `settings/ai_knowledge` ({ cards, updatedAt }). Every change runs in a transaction
 * on the latest copy of the document, so two open tabs can't overwrite each other's cards.
 */
export function useKnowledge() {
    const [cards, setCards] = useState<KnowledgeCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);

    useEffect(
        () =>
            onSnapshot(
                knowledgeRef(),
                (snap) => {
                    setCards(sanitizeCards(snap.exists() ? snap.data().cards : []));
                    setError(false);
                    setLoading(false);
                },
                (err) => {
                    console.error("Knowledge listen error:", err);
                    setError(true);
                    setLoading(false);
                }
            ),
        []
    );

    const mutate = async (id: string, change: (list: KnowledgeCard[]) => KnowledgeCard[], success?: string) => {
        setBusyId(id);
        try {
            await runTransaction(db, async (tx) => {
                const snap = await tx.get(knowledgeRef());
                const next = change(sanitizeCards(snap.exists() ? snap.data().cards : []));
                tx.set(knowledgeRef(), { cards: next.map(toFirestore), updatedAt: serverTimestamp() }, { merge: true });
            });
            if (success) toast.success(success);
            return true;
        } catch (err) {
            console.error("Knowledge save error:", err);
            toast.error("حدث خطأ أثناء الحفظ");
            return false;
        } finally {
            setBusyId(null);
        }
    };

    const saveCard = (card: KnowledgeCard) => {
        const now = Date.now();
        const stamped = { ...card, createdAt: card.createdAt || now, updatedAt: now };
        return mutate(
            card.id,
            (list) => (list.some((c) => c.id === card.id) ? list.map((c) => (c.id === card.id ? stamped : c)) : [...list, stamped]),
            "تم حفظ البطاقة"
        );
    };

    const deleteCard = (id: string) => mutate(id, (list) => list.filter((c) => c.id !== id), "تم حذف البطاقة");

    const toggle = (id: string, field: "active" | "pinned") =>
        mutate(id, (list) => list.map((c) => (c.id === id ? { ...c, [field]: !c[field], updatedAt: Date.now() } : c)));

    return { cards, loading, error, busyId, saveCard, deleteCard, toggle };
}
