interface GeminiModel {
    name: string;
    supportedGenerationMethods?: string[];
}

export async function discoverModels(apiKey: string, preferredModel?: string): Promise<string[]> {
    const candidateModels: string[] = [];
    const isAuto = !preferredModel || preferredModel.toLowerCase() === "auto" || preferredModel.toLowerCase() === "تلقائي";

    if (preferredModel && !isAuto) {
        candidateModels.push(preferredModel);
    }

    try {
        const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const modelsRes = await fetch(modelsUrl);

        if (modelsRes.ok) {
            const modelsData = await modelsRes.json();

            const allGeminis: GeminiModel[] = modelsData.models?.filter((m: GeminiModel) =>
                m.name.includes("gemini") &&
                m.supportedGenerationMethods?.includes("generateContent")
            ) || [];

            // Rank strategy: Flash 2.0 > Flash 1.5 > Pro 1.5
            const flash2 = allGeminis.filter((m) => m.name.includes("gemini-2.0-flash"));
            const flash15 = allGeminis.filter((m) => m.name.includes("gemini-1.5-flash"));
            const pro15 = allGeminis.filter((m) => m.name.includes("gemini-1.5-pro"));
            const otherFlash = allGeminis.filter((m) => m.name.includes("flash") && !flash2.length && !flash15.length);
            const others = allGeminis.filter((m) => !m.name.includes("flash"));

            [...flash2, ...flash15, ...pro15, ...otherFlash, ...others].forEach(m => {
                const name = m.name.startsWith("models/") ? m.name : `models/${m.name}`;
                if (!candidateModels.includes(name)) {
                    candidateModels.push(name);
                }
            });
        }
    } catch (e) {
        console.error("Model discovery failed:", e);
    }

    // Default Fallbacks if nothing found
    if (candidateModels.length === 0) {
        candidateModels.push("models/gemini-2.0-flash-exp", "models/gemini-1.5-flash", "models/gemini-1.5-pro");
    }

    return candidateModels;
}
