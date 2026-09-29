import { doc, getDoc, collection, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { stripLegacyTags } from "@/lib/ai/assistant/history";
import type { Message, PublicChatConfig, UserContext } from "@/components/chat/types";

export async function fetchUserContextData(user: User | null | undefined): Promise<UserContext> {
    if (!user) return { name: "Guest" };
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const data = userDoc.exists() ? userDoc.data() : {};
    return {
        name: data.name || user.displayName || "Guest",
        uid: user.uid,
        phone: data.phone || "",
    };
}

export async function fetchChatMessages(sid: string): Promise<Message[]> {
    const snapshot = await getDocs(query(collection(db, "chat_sessions", sid, "messages"), orderBy("timestamp", "asc")));
    const messages: Message[] = [];
    snapshot.forEach((d) => {
        const data = d.data();
        const text = typeof data.text === "string" ? stripLegacyTags(data.text).trim() : "";
        if (text && (data.role === "user" || data.role === "model")) messages.push({ role: data.role, text });
    });
    return messages;
}

/** Display texts from the dashboard (assistant name, subtitle, placeholder, welcome message). */
export async function fetchChatConfig(): Promise<PublicChatConfig> {
    const res = await fetch("/api/chat", { method: "GET" });
    if (!res.ok) throw new Error(`Chat config request failed (${res.status})`);
    const data = (await res.json()) as Partial<PublicChatConfig>;
    return {
        assistantName: data.assistantName || "",
        subtitle: data.subtitle || "",
        placeholder: data.placeholder || "",
        welcomeMessage: data.welcomeMessage || "",
    };
}

export async function deleteChatMessages(sid: string) {
    const snapshot = await getDocs(collection(db, "chat_sessions", sid, "messages"));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
}
