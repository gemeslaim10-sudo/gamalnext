import { NextResponse } from "next/server";
import { getArticlePrompt } from "@/lib/services/articleGenerator/prompts";
import { runGemini, runGroq, runHuggingFace, runOpenRouter, type ArticleResult } from "@/lib/services/articleGenerator/llmProviders";
import { fetchStockImage } from "@/lib/services/articleGenerator/imageFetcher";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    let geminiErrorMsg = "";
    let groqErrorMsg = "";
    let result: ArticleResult | null = null;

    try {
        const body = await req.json().catch(() => ({}));
        const { title } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const articlePrompt = getArticlePrompt(title);

        const geminiApiKey = process.env.GEMINI_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;
        const hfApiKey = process.env.HF_TOKEN;
        const openRouterApiKey = process.env.OPENROUTER_API_KEY;

        // 1. Try Gemini
        if (geminiApiKey) {
            try {
                result = await runGemini(articlePrompt, geminiApiKey);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Unknown Gemini Error";
                console.error("Gemini Generation Failed:", message);
                geminiErrorMsg = message;
            }
        } else {
            geminiErrorMsg = "Gemini API Key missing";
        }

        // 2. Try Groq
        if (!result && groqApiKey) {
            console.log("Falling back to Groq API...");
            try {
                result = await runGroq(articlePrompt, groqApiKey);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Unknown error";
                console.error("Groq Generation Failed:", message);
                groqErrorMsg = message;
            }
        } else if (!result && !groqApiKey) {
            groqErrorMsg = "Groq API Key missing";
        }

        // 3. Try Hugging Face
        if (!result && hfApiKey) {
            console.log("Falling back to Hugging Face API...");
            try {
                result = await runHuggingFace(articlePrompt, hfApiKey);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Unknown error";
                console.error("HF Generation Failed:", message);
                groqErrorMsg += ` | HF Error: ${message}`;
            }
        }

        // 4. Try OpenRouter
        if (!result && openRouterApiKey) {
            console.log("Falling back to OpenRouter API...");
            try {
                result = await runOpenRouter(articlePrompt, openRouterApiKey);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Unknown error";
                console.error("OpenRouter Generation Failed:", message);
                groqErrorMsg += ` | OpenRouter Error: ${message}`;
            }
        }

        if (!result) {
            return NextResponse.json({
                error: `فشل التوليد. Gemini: ${geminiErrorMsg}. Groq: ${groqErrorMsg}. HF/OR: Failed`
            }, { status: 500 });
        }

        // 5. Fetch High-Quality Stock Images
        const imageUrl = await fetchStockImage(result.imageKeyword);

        return NextResponse.json({
            content: result.content,
            imageSearchQuery: result.imagePrompt,
            imageUrl: imageUrl,
            metaDescription: result.metaDescription,
            seoKeywords: result.seoKeywords
        });

    } catch (error: unknown) {
        console.error("Article Generation Workflow Error:", error);
        return NextResponse.json({
            error: `Workflow Error: ${error instanceof Error ? error.message : "Unknown error"}. Gemini: ${geminiErrorMsg}. Groq: ${groqErrorMsg}`
        }, { status: 500 });
    }
}
