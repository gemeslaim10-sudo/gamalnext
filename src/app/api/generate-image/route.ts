import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { title } = await req.json();

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;

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

        // 1. Try Gemini with Dynamic Model Discovery
        if (geminiApiKey) {
            try {
                // Dynamic Model Discovery
                let selectedModelName = "gemini-1.5-flash"; // Safe fallback

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
                        const validModels = modelsData.models?.filter((m: any) =>
                            m.name.includes("gemini") &&
                            m.supportedGenerationMethods?.includes("generateContent") &&
                            !m.name.includes("vision")
                        );

                        if (validModels && validModels.length > 0) {
                            const flashModel = validModels.find((m: any) =>
                                m.name.includes("flash") && !m.name.includes("thinking")
                            );
                            const proModel = validModels.find((m: any) => m.name.includes("pro"));
                            const selectedModel = flashModel || proModel || validModels[0];
                            selectedModelName = selectedModel.name.replace(/^models\//, '');
                        }
                    }
                } catch (discoveryError) {
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

        // 2. Try Groq
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


        // 3. Fetch High-Quality Image from Unsplash
        let imageUrl = "";

        // Primary: Unsplash Source (Free, no key needed, high quality)
        const unsplashKeyword = encodeURIComponent(keyword);

        try {
            // Try Unsplash API first if key is available
            if (process.env.UNSPLASH_ACCESS_KEY) {
                const unsplashRes = await fetch(
                    `https://api.unsplash.com/photos/random?query=${unsplashKeyword}&orientation=landscape`,
                    { headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
                );

                if (unsplashRes.ok) {
                    const data = await unsplashRes.json();
                    if (data.urls?.regular) {
                        imageUrl = data.urls.regular;
                        console.log("✅ Unsplash API image loaded");
                    }
                }
            }

            // Fallback to Unsplash Source (no key needed)
            if (!imageUrl) {
                imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
                console.log("Using Unsplash Source");
            }
        } catch (error) {
            console.error("Unsplash error:", error);
            imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
        }

        // Fallback: Pexels (if available and Unsplash failed)
        const pexelsApiKey = process.env.PEXELS_API_KEY;
        if (!imageUrl && pexelsApiKey) {
            try {
                const randomPage = Math.floor(Math.random() * 10) + 1;
                const pexelsRes = await fetch(
                    `https://api.pexels.com/v1/search?query=${unsplashKeyword}&per_page=1&page=${randomPage}&orientation=landscape`,
                    { headers: { Authorization: pexelsApiKey } }
                );

                if (pexelsRes.ok) {
                    const pexelsData = await pexelsRes.json();
                    if (pexelsData.photos && pexelsData.photos.length > 0) {
                        imageUrl = pexelsData.photos[0].src.large;
                        console.log("✅ Pexels image loaded");
                    }
                }
            } catch (error) {
                console.error("Pexels (Gen Image) Error:", error);
            }
        }

        // Final fallback
        if (!imageUrl) {
            imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
        }


        return NextResponse.json({ imageUrl });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
