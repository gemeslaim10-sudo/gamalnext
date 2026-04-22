import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export type AiConfig = {
    prompt: string;
    systemRole?: string;
    stylePrompt?: string;
    welcomeMessage: string;
    modelName: string;
    geminiKey?: string;
    groqKey?: string;
    openRouterKey?: string;
    openaiKey?: string;
    huggingfaceKey?: string;
}

export async function getAiConfig(): Promise<AiConfig> {
    try {
        const docRef = doc(db, "settings", "ai");
        const docSnap = await getDoc(docRef);
        
        const data = docSnap.exists() ? docSnap.data() : {};
        
        return {
            prompt: data.prompt || "",
            systemRole: data.systemRole || "",
            stylePrompt: data.stylePrompt || "",
            welcomeMessage: data.welcomeMessage || "",
            modelName: data.modelName || "gemini-2.5-flash",
            // Priority: DB Key > ENV Key
            geminiKey: data.geminiKey || process.env.GEMINI_API_KEY,
            groqKey: data.groqKey || process.env.GROQ_API_KEY,
            openRouterKey: data.openRouterKey || process.env.OPENROUTER_API_KEY,
            openaiKey: data.openaiKey || process.env.OPENAI_API_KEY,
            huggingfaceKey: data.huggingfaceKey || process.env.HUGGINGFACE_API_KEY,
        };
    } catch (error) {
        console.error("Error getting AI config:", error);
        return {
            prompt: "",
            welcomeMessage: "",
            modelName: "gemini-2.5-flash",
            geminiKey: process.env.GEMINI_API_KEY,
        };
    }
}
