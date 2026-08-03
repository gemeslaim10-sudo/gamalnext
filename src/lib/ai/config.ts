import { getAdminDb } from "@/lib/firebase-admin";

export type AiConfig = {
    welcomeMessage: string;
    modelName: string;
    geminiKey?: string;
    groqKey?: string;
    openRouterKey?: string;
    openaiKey?: string;
    huggingfaceKey?: string;
}

let cachedConfig: AiConfig | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

export async function getAiConfig(): Promise<AiConfig> {
    try {
        const now = Date.now();
        if (cachedConfig && (now - lastFetchTime) < CACHE_TTL) {
            return cachedConfig;
        }

        const docSnap = await getAdminDb().collection("settings").doc("ai").get();
        
        const data = docSnap.exists ? docSnap.data() || {} : {};
        
        cachedConfig = {
            welcomeMessage: data.welcomeMessage || "",
            modelName: data.modelName || "gemini-2.5-flash",
            // Priority: DB Key > ENV Key
            geminiKey: data.geminiKey || process.env.GEMINI_API_KEY,
            groqKey: data.groqKey || process.env.GROQ_API_KEY,
            openRouterKey: data.openRouterKey || process.env.OPENROUTER_API_KEY,
            openaiKey: data.openaiKey || process.env.OPENAI_API_KEY,
            huggingfaceKey: data.huggingfaceKey || process.env.HUGGINGFACE_API_KEY,
        };
        lastFetchTime = now;
        return cachedConfig;
    } catch (error) {
        console.error("Error getting AI config:", error);
        return cachedConfig || {
            welcomeMessage: "",
            modelName: "gemini-2.5-flash",
            geminiKey: process.env.GEMINI_API_KEY,
        };
    }
}
