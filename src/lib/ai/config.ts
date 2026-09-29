// Kept for other AI features (e.g. /api/enhance-title) that only need the keys and the model.
// The chat assistant itself uses ./assistant/settings.
import { loadSettings } from "./assistant/settings";

export type AiConfig = {
    welcomeMessage: string;
    modelName: string;
    geminiKey?: string;
    groqKey?: string;
    openRouterKey?: string;
    openaiKey?: string;
    huggingfaceKey?: string;
};

export async function getAiConfig(): Promise<AiConfig> {
    const { profile, keys } = await loadSettings();
    return {
        welcomeMessage: profile.welcomeMessage,
        modelName: profile.modelName,
        geminiKey: keys.gemini,
        groqKey: keys.groq,
        openRouterKey: keys.openRouter,
        openaiKey: keys.openai,
        huggingfaceKey: keys.huggingface,
    };
}
