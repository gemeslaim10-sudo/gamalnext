import { parseJsonFromLLM, cleanText } from "./utils";
import type { ArticleResult } from "./types";

export const runHuggingFace = async (prompt: string, apiKey: string): Promise<ArticleResult | null> => {
    const hfRes = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "moonshotai/Kimi-K2-Instruct-0905",
            messages: [
                { role: "system", content: "You are an API that outputs ONLY JSON. You write in PURE ARABIC." },
                { role: "user", content: prompt }
            ],
            max_tokens: 4000,
            temperature: 0.7
        })
    });

    if (!hfRes.ok) {
        throw new Error(`HF API Error: ${hfRes.status}`);
    }

    const hfData = await hfRes.json();
    const rawContent = hfData.choices[0]?.message?.content || "";
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
