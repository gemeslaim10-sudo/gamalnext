import type { User } from "firebase/auth";
import { loadFirestore } from "@/lib/firebase-app";
import type { PublicChatConfig, UserContext } from "@/components/chat/types";

export async function fetchUserContextData(user: User | null | undefined): Promise<UserContext> {
    if (!user) return { name: "Guest" };
    // The database library loads when the chat opens, not with every page
    const { db, doc, getDoc } = await loadFirestore();
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const data = userDoc.exists() ? userDoc.data() : {};
    return {
        name: data.name || user.displayName || "Guest",
        uid: user.uid,
        phone: data.phone || "",
    };
}

/** Conversations used to be saved under an id kept in the browser; they aren't any more. */
export function forgetOldChatSession() {
    try {
        localStorage.removeItem("chatSessionId");
    } catch {
        // Storage blocked: nothing to forget
    }
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
