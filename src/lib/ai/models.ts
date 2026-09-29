import { DEFAULT_MODEL, GEMINI_FALLBACK_MODELS } from "./assistant/shared";

interface GeminiModel {
    name: string;
    supportedGenerationMethods?: string[];
}

/**
 * Returns Gemini model ids to try, best first: the preferred model (when given), then the
 * stable "latest" aliases, then other text models this key can use.
 */
export async function discoverModels(apiKey: string, preferredModel?: string): Promise<string[]> {
    const candidates: string[] = [];
    const add = (name: string) => {
        const id = name.replace(/^models\//, "");
        if (id && !candidates.includes(id)) candidates.push(id);
    };

    const preferred = (preferredModel || "").trim();
    if (preferred && preferred !== "auto" && preferred !== "تلقائي") add(preferred);
    [DEFAULT_MODEL, ...GEMINI_FALLBACK_MODELS].forEach(add);

    try {
        const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", {
            headers: { "x-goog-api-key": apiKey },
        });
        if (res.ok) {
            const data = (await res.json()) as { models?: GeminiModel[] };
            (data.models || [])
                .filter((m) => /gemini-[\d.]+-(flash|pro)$|gemini-(flash|pro)-latest$/.test(m.name))
                .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
                .forEach((m) => add(m.name));
        }
    } catch (e) {
        console.error("Model discovery failed:", e);
    }

    return candidates;
}
