// Server only: reads the assistant settings and knowledge with the Admin SDK (both documents
// are admin-only in firestore.rules), cached for a minute so every chat message doesn't hit Firestore.
import { getAdminDb } from "@/lib/firebase-admin";
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

const CACHE_TTL_MS = 60_000;

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

interface CacheEntry<T> {
    value: T;
    at: number;
}

let settingsCache: CacheEntry<LoadedSettings> | null = null;
let knowledgeCache: CacheEntry<KnowledgeCard[]> | null = null;

const isFresh = <T>(entry: CacheEntry<T> | null): entry is CacheEntry<T> => !!entry && Date.now() - entry.at < CACHE_TTL_MS;

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
    if (!fresh && isFresh(settingsCache)) return settingsCache.value;
    try {
        const snap = await getAdminDb().collection(AI_SETTINGS_DOC.collection).doc(AI_SETTINGS_DOC.id).get();
        const data = snap.exists ? snap.data() : undefined;
        const value: LoadedSettings = { profile: resolveProfile(data), keys: resolveKeys(data), fromDatabase: true };
        settingsCache = { value, at: Date.now() };
        return value;
    } catch (error) {
        console.error("[assistant] Could not read settings/ai:", error);
        // An older copy is better than the built-in defaults
        if (settingsCache) return settingsCache.value;
        return { profile: resolveProfile(undefined), keys: resolveKeys(undefined), fromDatabase: false };
    }
}

export async function loadKnowledge({ fresh = false }: { fresh?: boolean } = {}): Promise<KnowledgeCard[]> {
    if (!fresh && isFresh(knowledgeCache)) return knowledgeCache.value;
    try {
        const snap = await getAdminDb().collection(AI_KNOWLEDGE_DOC.collection).doc(AI_KNOWLEDGE_DOC.id).get();
        const cards = sanitizeCards(snap.exists ? snap.data()?.cards : []);
        knowledgeCache = { value: cards, at: Date.now() };
        return cards;
    } catch (error) {
        console.error("[assistant] Could not read settings/ai_knowledge:", error);
        return knowledgeCache?.value ?? [];
    }
}

/** What the chat widget may know: display texts only, never keys or instructions. */
export async function getPublicChatConfig(): Promise<PublicChatConfig & { fallback: boolean }> {
    const { profile, fromDatabase } = await loadSettings();
    return { ...toPublicConfig(profile), fallback: !fromDatabase };
}
