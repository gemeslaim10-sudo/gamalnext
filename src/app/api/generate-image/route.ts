import { NextResponse } from "next/server";
import { generateImageKeyword, fetchStockImage } from "@/lib/ai/generateImageHelpers";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { title } = await req.json();

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;
        const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
        const pexelsKey = process.env.PEXELS_API_KEY;

        const keyword = await generateImageKeyword(title, geminiApiKey, groqApiKey);
        const imageUrl = await fetchStockImage(keyword, unsplashKey, pexelsKey);

        return NextResponse.json({ imageUrl });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
