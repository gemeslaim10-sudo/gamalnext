// Server only: reads the assistant settings and knowledge with the Admin SDK (both documents
// are admin-only in firestore.rules). They are cached with no time limit like the rest of the site
// content (src/lib/cache.ts): saving in the dashboard or "Clear cache" refreshes them.
import { unstable_noStore } from "next/cache";
import { getAdminDb } from "@/lib/firebase-admin";
import { CACHE_TAGS, cached } from "@/lib/cache";
import {
    AI_KNOWLEDGE_DOC,
    AI_SETTINGS_DOC,
    resolveProfile,
    sanitizeCards,
    toPublicConfig,
    type AssistantProfile,
    type KnowledgeCard,
    type PublicChatConfig,
} from "./shared";

export interface ProviderKeys {
    gemini?: string;
    groq?: string;
    openRouter?: string;
    openai?: string;
    huggingface?: string;
}

export interface LoadedSettings {
    profile: AssistantProfile;
    keys: ProviderKeys;
    /** False when Firestore couldn't be read and the built-in defaults are in use */
    fromDatabase: boolean;
}

async function readDocData(id: string) {
    const snap = await getAdminDb().collection(AI_SETTINGS_DOC.collection).doc(id).get();
    return snap.exists ? ((snap.data() ?? null) as Record<string, unknown> | null) : null;
}

// The raw documents are cached; keys and defaults are resolved on every call so environment keys stay current
const readSettingsDoc = cached(() => readDocData(AI_SETTINGS_DOC.id), "ai-settings", [CACHE_TAGS.ai]);
const readKnowledgeDoc = cached(() => readDocData(AI_KNOWLEDGE_DOC.id), "ai-knowledge", [CACHE_TAGS.ai]);

// Last good copies, used when a read fails (per server instance)
let lastSettings: Record<string, unknown> | null | undefined;
let lastKnowledge: unknown[] | undefined;

/** A key saved in the dashboard wins over the one in the environment. */
function resolveKeys(data: Record<string, unknown> | undefined): ProviderKeys {
    const pick = (field: string, env: string | undefined) => {
        const saved = data?.[field];
        return (typeof saved === "string" && saved.trim()) || env?.trim() || undefined;
    };
    return {
        gemini: pick("geminiKey", process.env.GEMINI_API_KEY),
        groq: pick("groqKey", process.env.GROQ_API_KEY),
        openRouter: pick("openRouterKey", process.env.OPENROUTER_API_KEY),
        openai: pick("openaiKey", process.env.OPENAI_API_KEY),
        huggingface: pick("huggingfaceKey", process.env.HUGGINGFACE_API_KEY),
    };
}

/** `fresh` skips the cache (used by the admin test page right after saving). */
export async function loadSettings({ fresh = false }: { fresh?: boolean } = {}): Promise<LoadedSettings> {
    try {
        const data = fresh ? await readDocData(AI_SETTINGS_DOC.id) : await readSettingsDoc();
        lastSettings = data;
        return { profile: resolveProfile(data ?? undefined), keys: resolveKeys(data ?? undefined), fromDatabase: true };
    } catch (error) {
        console.error("[assistant] Could not read settings/ai:", error);
        // A page showing this fallback must not be cached
        unstable_noStore();
        // An older copy is better than the built-in defaults
        if (lastSettings !== undefined) {
            const data = lastSettings ?? undefined;
            return { profile: resolveProfile(data), keys: resolveKeys(data), fromDatabase: true };
        }
        return { profile: resolveProfile(undefined), keys: resolveKeys(undefined), fromDatabase: false };
    }
}

export async function loadKnowledge({ fresh = false }: { fresh?: boolean } = {}): Promise<KnowledgeCard[]> {
    try {
        const data = fresh ? await readDocData(AI_KNOWLEDGE_DOC.id) : await readKnowledgeDoc();
        const cards = Array.isArray(data?.cards) ? (data.cards as unknown[]) : [];
        lastKnowledge = cards;
        return sanitizeCards(cards);
    } catch (error) {
        console.error("[assistant] Could not read settings/ai_knowledge:", error);
        return sanitizeCards(lastKnowledge ?? []);
    }
}

/** What the chat widget may know: display texts only, never keys or instructions. */
export async function getPublicChatConfig(): Promise<PublicChatConfig & { fallback: boolean }> {
    const { profile, fromDatabase } = await loadSettings();
    return { ...toPublicConfig(profile), fallback: !fromDatabase };
}
