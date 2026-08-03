import { toolHandlers } from "../tools";

export async function getRagContext(query: string) {
    try {
        const results = await toolHandlers.search_knowledge_base({ query });
        if (!results?.length) return "";
        return "\n\n[REAL-TIME DATA]:\n" + results.map(r => `- ${r.type}: ${r.title || "Info"}`).join("\n");
    } catch {
        return "";
    }
}
