import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    let geminiErrorMsg = "";
    let groqErrorMsg = "";

    try {
        const body = await req.json().catch(() => ({}));
        const { title } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;

        const articlePrompt = `
        You are an EXCEPTIONAL content creator and expert storyteller. Your mission is to write articles that readers LOVE and remember.
        
        Topic: "${title}"
        
        🎯 YOUR MISSION: Create content so valuable that readers will:
        - Learn something new and actionable
        - Feel entertained and engaged throughout
        - Want to share it with friends
        - Come back for more
        
        📝 CONTENT STYLE RULES:
        
        1. **START STRONG** (Critical!):
           - Open with a fascinating story, surprising statistic, or thought-provoking question
           - Make the reader curious from the first sentence
           - NO generic introductions like "في هذا المقال سنتحدث عن..."
           - Example: Start with a real scenario, an interesting fact, or a bold statement
        
        2. **BE CONVERSATIONAL & ENGAGING**:
           - Write like you're talking to a smart friend over coffee
           - Use "أنت" to address the reader directly
           - Ask rhetorical questions that make them think
           - Vary sentence length: short punchy sentences mixed with detailed explanations
           - Use emojis occasionally (💡 🚀 ⚡) but don't overdo it
        
        3. **PROVIDE REAL VALUE**:
           - Share SPECIFIC, ACTIONABLE information
           - Include concrete examples from real companies or scenarios
           - Explain the "why" behind things, not just the "what"
           - Give practical tips readers can use immediately
           - Present unique perspectives or lesser-known insights
           - Include recent trends or developments (2024-2026)
        
        4. **STORYTELLING TECHNIQUES**:
           - Use analogies to explain complex concepts
           - Include mini case studies or real-world examples
           - Create mental images with descriptive language
           - Build narrative tension and resolution
           - Make abstract concepts concrete and relatable
        
        5. **CREDIBLE & WELL-RESEARCHED**:
           - Include 8-12 hyperlinks to authoritative sources
           - Link to: Wikipedia (ar/en), TechCrunch, Wired, BBC, Reuters, Al Jazeera, official docs (MDN, Microsoft Docs)
           - Embed links NATURALLY in sentences - don't say "كما ذكر في المقال"
           - Each link should support a specific claim or provide additional depth
           - Example: "شركات مثل [Google](url) و[Microsoft](url) تستثمر مليارات الدولارات في هذا المجال"
        
        6. **STRUCTURE**:
           - Opening hook (2-3 engaging paragraphs)
           - Main content (5-7 paragraphs, each with a clear point)
           - Practical insights section with actionable tips
           - Memorable conclusion (not "في الختام...")
        
        🚫 AVOID AT ALL COSTS:
        - Generic, boring openings
        - Repetitive phrases like "وفقاً لما ذكر في المقال" (just link naturally!)
        - Surface-level information everyone knows
        - Filler content that adds no value
        - Excessive formality - be professional but warm
        - Ending with "وفي الختام يمكن القول..."
        
        ✅ INSTEAD, DO THIS:
        - Start with a hook that surprises or intrigues
        - Link naturally: "تقول [Google](url) أن..." or "وفقاً لـ[BBC](url)..."
        - Share insider knowledge or fresh perspectives
        - Every paragraph should teach something new
        - End with a powerful thought or call-to-action
        
        📋 TECHNICAL JSON OUTPUT:
        
        {
          "article_content": "Your amazing Arabic article here (800-1000 words)",
          "image_prompt": "Detailed English description for a realistic, professional photo",
          "image_keyword": "Single precise keyword for Unsplash (e.g., 'programming', 'business', 'technology')",
          "meta_description": "Compelling Arabic SEO description (max 160 chars) that makes people click",
          "seo_keywords": "5-8 Arabic keywords, comma-separated"
        }
        
        FORMATTING RULES:
        - Pure Arabic (العربية الفصحى) - technical English terms OK
        - NO foreign scripts (Chinese, Korean, Japanese, etc.)
        - Links: [text](url) format ONLY
        - NO markdown headers (###), bold (**), italics (*)
        - Double line breaks (\\n\\n) between paragraphs
        
        💎 REMEMBER: Quality over everything. Every sentence must earn its place. Make it AMAZING!
        `;

        let content = "";
        let metaDescription = "";
        let seoKeywords = "";
        let imagePrompt = "";
        let imageKeyword = "technology";
        let geminiSuccess = false;

        const parseJsonFromLLM = (text: string) => {
            try {
                // Try to find JSON block if mixed with text
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : text;
                return JSON.parse(jsonStr);
            } catch (e) {
                return null;
            }
        };

        const cleanText = (text: string) => {
            if (!text) return "";
            // 1. Remove non-safe characters: Keep Arabic, English, Numbers, Punctuation, Newlines
            // Regex explanation:
            // \u0600-\u06FF: Arabic
            // a-zA-Z0-9: English/Numbers
            // \s: Whitespace
            // .,!?:;"'()[]{}-_@%&/=+~: Common punctuation and URL safe chars
            // Added \/ \& \= \+ \~ for URLs
            let cleaned = text.replace(/[^\u0600-\u06FFa-zA-Z0-9\s.,!?:;"'()[\]{}\-_@%&\/=+~]/g, " ");

            // 2. Fix multiple spaces
            cleaned = cleaned.replace(/ +/g, " ");

            // 3. Trim
            return cleaned.trim();
        };

        if (geminiApiKey) {
            try {
                // Dynamic Model Discovery with robust error handling
                let selectedModelName = "gemini-1.5-flash"; // Safe fallback

                try {
                    const modelsRes = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`,
                        {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            signal: AbortSignal.timeout(5000) // 5 second timeout
                        }
                    );

                    if (modelsRes.ok) {
                        const modelsData = await modelsRes.json();
                        const validModels = modelsData.models?.filter((m: any) =>
                            m.name.includes("gemini") &&
                            m.supportedGenerationMethods?.includes("generateContent") &&
                            !m.name.includes("vision") // Exclude vision-only models
                        );

                        if (validModels && validModels.length > 0) {
                            // Priority: flash > pro > any available
                            const flashModel = validModels.find((m: any) =>
                                m.name.includes("flash") && !m.name.includes("thinking")
                            );
                            const proModel = validModels.find((m: any) => m.name.includes("pro"));
                            const selectedModel = flashModel || proModel || validModels[0];

                            // Extract model name (remove "models/" prefix if present)
                            selectedModelName = selectedModel.name.replace(/^models\//, '');
                            console.log(`✅ Dynamic Model Selected: ${selectedModelName}`);
                        } else {
                            console.log(`⚠️ No valid models found, using fallback: ${selectedModelName}`);
                        }
                    } else {
                        console.log(`⚠️ Models API returned ${modelsRes.status}, using fallback: ${selectedModelName}`);
                    }
                } catch (discoveryError: any) {
                    console.log(`⚠️ Model discovery failed (${discoveryError.message}), using fallback: ${selectedModelName}`);
                }

                const genAI = new GoogleGenerativeAI(geminiApiKey);
                const model = genAI.getGenerativeModel({
                    model: selectedModelName,
                    generationConfig: { responseMimeType: "application/json" }
                });
                const result = await model.generateContent(articlePrompt);
                const response = await result.response;
                const jsonResult = parseJsonFromLLM(response.text());

                if (jsonResult) {
                    content = cleanText(jsonResult.article_content);
                    imagePrompt = jsonResult.image_prompt || "technology";
                    imageKeyword = jsonResult.image_keyword || "technology";
                    metaDescription = jsonResult.meta_description || "";
                    seoKeywords = jsonResult.seo_keywords || "";
                    geminiSuccess = true;
                }

            } catch (geminiError: any) {
                console.error("Gemini Generation Failed:", geminiError.message);
                geminiErrorMsg = geminiError.message || "Unknown Gemini Error";
            }
        } else {
            geminiErrorMsg = "Gemini API Key missing";
        }

        // 2. Groq Fallback
        if (!geminiSuccess && groqApiKey) {
            console.log("Falling back to Groq API...");
            try {
                const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${groqApiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: "You are an API that outputs ONLY JSON. You write in PURE ARABIC." },
                            { role: "user", content: articlePrompt }
                        ],
                        response_format: { type: "json_object" } // Force JSON for Groq/Llama
                    })
                });

                if (!groqRes.ok) {
                    const errText = await groqRes.text();
                    throw new Error(`Groq API Error: ${groqRes.status} ${errText}`);
                }

                const groqData = await groqRes.json();
                const rawContent = groqData.choices[0]?.message?.content || "";
                const jsonResult = parseJsonFromLLM(rawContent);

                if (jsonResult) {
                    content = cleanText(jsonResult.article_content);
                    imagePrompt = jsonResult.image_prompt || "technology";
                    imageKeyword = jsonResult.image_keyword || "technology";
                    metaDescription = jsonResult.meta_description || "";
                    seoKeywords = jsonResult.seo_keywords || "";
                }

            } catch (groqError: any) {
                console.error("Groq Generation Failed:", groqError.message);
                groqErrorMsg = groqError.message;
            }
        } else if (!geminiSuccess && !groqApiKey) {
            groqErrorMsg = "Groq API Key missing";
        }

        // 3. Hugging Face Fallback (MoonshotAI/Kimi-K2-Instruct-0905)
        const hfApiKey = process.env.HF_TOKEN;

        if (!content && hfApiKey) {
            console.log("Falling back to Hugging Face API...");
            try {
                const hfRes = await fetch("https://router.huggingface.co/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${hfApiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "moonshotai/Kimi-K2-Instruct-0905",
                        messages: [
                            { role: "system", content: "You are an API that outputs ONLY JSON. You write in PURE ARABIC." },
                            { role: "user", content: articlePrompt }
                        ],
                        max_tokens: 4000, // Generous limit for article
                        temperature: 0.7
                    })
                });

                if (!hfRes.ok) {
                    const errText = await hfRes.text();
                    throw new Error(`HF API Error: ${hfRes.status} ${errText}`);
                }

                const hfData = await hfRes.json();
                const rawContent = hfData.choices[0]?.message?.content || "";
                const jsonResult = parseJsonFromLLM(rawContent);

                if (jsonResult) {
                    content = cleanText(jsonResult.article_content);
                    imagePrompt = jsonResult.image_prompt || "technology";
                    imageKeyword = jsonResult.image_keyword || "technology";
                    metaDescription = jsonResult.meta_description || "";
                    seoKeywords = jsonResult.seo_keywords || "";
                }

            } catch (hfError: any) {
                console.error("HF Generation Failed:", hfError.message);
                // We don't need a separate variable if we just append to the error response below
                groqErrorMsg += ` | HF Error: ${hfError.message}`;
            }
        }

        // 4. OpenRouter Fallback
        const openRouterApiKey = process.env.OPENROUTER_API_KEY;

        if (!content && openRouterApiKey) {
            console.log("Falling back to OpenRouter API...");
            try {
                const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${openRouterApiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://gamal-app.com", // Required by OpenRouter
                        "X-Title": "Gamal App"
                    },
                    body: JSON.stringify({
                        model: "google/gemini-2.0-flash-exp:free", // Using a free/reliable model
                        messages: [
                            { role: "system", content: "You are an API that outputs ONLY JSON. You write in PURE ARABIC." },
                            { role: "user", content: articlePrompt }
                        ],
                        response_format: { type: "json_object" }
                    })
                });

                if (!orRes.ok) {
                    const errText = await orRes.text();
                    throw new Error(`OpenRouter API Error: ${orRes.status} ${errText}`);
                }

                const orData = await orRes.json();
                const rawContent = orData.choices[0]?.message?.content || "";
                const jsonResult = parseJsonFromLLM(rawContent);

                if (jsonResult) {
                    content = cleanText(jsonResult.article_content);
                    imagePrompt = jsonResult.image_prompt || "technology";
                    imageKeyword = jsonResult.image_keyword || "technology";
                    metaDescription = jsonResult.meta_description || "";
                    seoKeywords = jsonResult.seo_keywords || "";
                }

            } catch (orError: any) {
                console.error("OpenRouter Generation Failed:", orError.message);
                groqErrorMsg += ` | OpenRouter Error: ${orError.message}`;
            }
        }

        if (!content) {
            return NextResponse.json({
                error: `فشل التوليد. Gemini: ${geminiErrorMsg}. Groq: ${groqErrorMsg}. HF/OR: Failed`
            }, { status: 500 });
        }


        // 3. Fetch High-Quality Stock Images
        let imageUrl = "";

        // Primary: Unsplash (Free, High Quality, 50 requests/hour without key)
        // Using Unsplash Source API (simple, no auth needed for basic usage)
        const unsplashKeyword = encodeURIComponent(imageKeyword || "technology");
        try {
            // Unsplash Source gives us a redirect to a random high-quality image
            // We'll use the direct photo endpoint for better control
            const unsplashRes = await fetch(
                `https://api.unsplash.com/photos/random?query=${unsplashKeyword}&orientation=landscape&client_id=YOUR_ACCESS_KEY_OR_DEMO`,
                {
                    headers: process.env.UNSPLASH_ACCESS_KEY ?
                        { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } :
                        {}
                }
            );

            if (unsplashRes.ok) {
                const unsplashData = await unsplashRes.json();
                if (unsplashData.urls?.regular) {
                    imageUrl = unsplashData.urls.regular;
                    console.log("✅ Unsplash image loaded successfully");
                }
            } else {
                // Fallback to Unsplash Source (simpler, no key needed)
                imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
                console.log("⚠️ Using Unsplash Source fallback");
            }
        } catch (error) {
            console.error("Unsplash fetch error:", error);
            // Try Unsplash Source as error fallback
            imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
        }

        // Fallback: Pexels API (if Unsplash fails and key is available)
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
                        console.log("✅ Pexels image loaded as fallback");
                    }
                }
            } catch (error) {
                console.error("Pexels fetch error:", error);
            }
        }

        // Final fallback: Unsplash Source (always works, no key needed)
        if (!imageUrl) {
            imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
            console.log("Using final Unsplash Source fallback");
        }


        return NextResponse.json({
            content: content,
            imageSearchQuery: imagePrompt, // Keep detailed prompt for manual search
            imageUrl: imageUrl,
            metaDescription: metaDescription,
            seoKeywords: seoKeywords
        });

    } catch (error: any) {
        console.error("Article Generation Workflow Error:", error);
        return NextResponse.json({
            error: `Workflow Error: ${error.message}. Gemini: ${geminiErrorMsg}. Groq: ${groqErrorMsg}`
        }, { status: 500 });
    }
}
