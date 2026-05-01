import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseJsonFromLLM, cleanText } from "./utils";
import type { ArticleResult } from "./types";

export const runGemini = async (prompt: string, apiKey: string): Promise<ArticleResult | null> => {
    let selectedModelName = "gemini-1.5-flash";
    try {
        const modelsRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
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
                console.log(`✅ Dynamic Model Selected: ${selectedModelName}`);
            }
        }
    } catch {
        console.log(`⚠️ Model discovery failed, using fallback: ${selectedModelName}`);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: selectedModelName,
        generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonResult = parseJsonFromLLM(response.text());

    if (jsonResult) {
        return {
            content: cleanText(jsonResult.article_content),
            imagePrompt: jsonResult.image_prompt || "technology",
            imageKeyword: jsonResult.image_keyword || "technology",
            metaDescription: jsonResult.meta_description || "",
            seoKeywords: jsonResult.seo_keywords || ""
        };
    }
    return null;
};
