export async function discoverModels(apiKey: string, preferredModel?: string): Promise<string[]> {
    let candidateModels: string[] = [];

    if (preferredModel) {
        candidateModels.push(preferredModel);
    }

    try {
        const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const modelsRes = await fetch(modelsUrl);

        if (modelsRes.ok) {
            const modelsData = await modelsRes.json();

            const allGeminis = modelsData.models?.filter((m: any) =>
                m.name.includes("gemini") &&
                m.supportedGenerationMethods?.includes("generateContent")
            ) || [];

            const flashModels = allGeminis.filter((m: any) => m.name.includes("flash"));
            const otherModels = allGeminis.filter((m: any) => !m.name.includes("flash"));

            [...flashModels, ...otherModels].forEach(m => {
                if (!candidateModels.includes(m.name)) {
                    candidateModels.push(m.name);
                }
            });
        }
    } catch (e) {
        console.error("Model discovery failed:", e);
    }

    if (candidateModels.length === 0) {
        candidateModels.push("models/gemini-1.5-flash"); // Ultimate fallback
    }

    return candidateModels;
}
