import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateImageKeyword(title: string, geminiApiKey?: string, groqApiKey?: string) {
    const prompt = `
    You are an expert visual curator.
    The user has an article title in ARABIC: "${title}".
    
    Your task:
    1. Understand the core topic of the Arabic title.
    2. Translate the core concept into a PRECISE English search query for a stock photo site (Pexels/Unsplash).
    3. The query should be 2-3 words max (e.g., "business meeting", "healthy food", "programming code").
    4. Avoid abstract terms. Be visual.
    
    Examples:
    - Arabic: "كيفية الربح من الإنترنت" -> "digital nomad money"
    - Arabic: "أفضل أماكن السياحة في مصر" -> "egypt pyramids tourism"
    - Arabic: "طرق العناية بالبشرة" -> "skin care woman"
    
    OUTPUT RULES:
    - JSON ONLY: { "keyword": "..." }
    - NO explanation.
    `;

    let keyword = "technology";
    let success = false;

    const parseJson = (text: string) => {
        try {
            const match = text.match(/\{[\s\S]*\}/);
            return match ? JSON.parse(match[0]) : null;
        } catch { return null; }
    };

    if (geminiApiKey) {
        try {
            let selectedModelName = "gemini-1.5-flash";

            try {
                const modelsRes = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        signal: AbortSignal.timeout(5000)
                    }
                );

                if (modelsRes.ok) {
                    const modelsData = await modelsRes.json();
                    const validModels = modelsData.models?.filter((m: { name: string; supportedGenerationMethods?: string[] }) =>
                        m.name.includes("gemini") &&
                        m.supportedGenerationMethods?.includes("generateContent") &&
                        !m.name.includes("vision")
                    );

                    if (validModels && validModels.length > 0) {
                        const flashModel = validModels.find((m: { name: string }) =>
                            m.name.includes("flash") && !m.name.includes("thinking")
                        );
                        const proModel = validModels.find((m: { name: string }) => m.name.includes("pro"));
                        const selectedModel = flashModel || proModel || validModels[0];
                        selectedModelName = selectedModel.name.replace(/^models\//, '');
                    }
                }
            } catch {
                console.log(`⚠️ Model discovery failed, using fallback: ${selectedModelName}`);
            }

            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({
                model: selectedModelName,
                generationConfig: { responseMimeType: "application/json" }
            });
            const result = await model.generateContent(prompt);
            const json = parseJson(result.response.text());
            if (json?.keyword) {
                keyword = json.keyword;
                success = true;
            }
        } catch (e) {
            console.error("Gemini Image Gen Error:", e);
        }
    }

    if (!success && groqApiKey) {
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${groqApiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                })
            });
            const data = await res.json();
            const json = parseJson(data.choices[0].message.content);
            if (json?.keyword) {
                keyword = json.keyword;
            }
        } catch (e) {
            console.error("Groq Image Gen Error:", e);
        }
    }

    return keyword;
}
