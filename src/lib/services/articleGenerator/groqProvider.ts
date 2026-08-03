import { parseJsonFromLLM, cleanText } from "./utils";
import type { ArticleResult } from "./types";

export const runGroq = async (prompt: string, apiKey: string): Promise<ArticleResult | null> => {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are an API that outputs ONLY JSON. You write in PURE ARABIC." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        })
    });

    if (!groqRes.ok) {
        throw new Error(`Groq API Error: ${groqRes.status}`);
    }

    const groqData = await groqRes.json();
    const rawContent = groqData.choices[0]?.message?.content || "";
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
