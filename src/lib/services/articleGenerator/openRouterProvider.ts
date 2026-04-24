import { parseJsonFromLLM, cleanText } from "./utils";
import type { ArticleResult } from "./types";

export const runOpenRouter = async (prompt: string, apiKey: string): Promise<ArticleResult | null> => {
    const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://gamaltech.info",
            "X-Title": "GamalTech"
        },
        body: JSON.stringify({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                { role: "system", content: "You are an API that outputs ONLY JSON. You write in PURE ARABIC." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        })
    });

    if (!orRes.ok) {
        throw new Error(`OpenRouter API Error: ${orRes.status}`);
    }

    const orData = await orRes.json();
    const rawContent = orData.choices[0]?.message?.content || "";
    const jsonResult = parseJsonFromLLM(rawContent);

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
