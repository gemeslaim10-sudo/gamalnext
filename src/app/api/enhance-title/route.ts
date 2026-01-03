import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { title } = await req.json();

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        // Dynamic Model Discovery with robust error handling
        let selectedModelName = "gemini-1.5-flash"; // Safe fallback

        try {
            const modelsRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
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
        } catch (error: any) {
            console.log(`⚠️ Model discovery failed (${error.message}), using fallback: ${selectedModelName}`);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: selectedModelName });

        const prompt = `
        You are an ELITE copywriter and headline expert specializing in viral, click-worthy Arabic titles.
        
        Original title: "${title}"
        
        🎯 YOUR MISSION:
        Transform this title into something IRRESISTIBLE that makes readers instantly want to click and read.
        
        ✨ RULES FOR THE PERFECT TITLE:
        
        1. **MAKE IT CATCHY**:
           - Use power words that trigger curiosity or emotion (e.g., "سر", "حقيقة", "مفاجأة", "خطوات")
           - Create intrigue or promise a benefit
           - Use numbers when relevant (e.g., "5 طرق", "أفضل 7", "خطوات 3")
           - Make a bold promise or revelation
        
        2. **OPTIMIZE FOR SEO**:
           - Include relevant keywords naturally
           - Keep it between 40-60 characters for best results
           - Make it descriptive yet compelling
        
        3. **BE CONVERSATIONAL**:
           - Write in modern, engaging Arabic
           - Address the reader's curiosity or need
           - Use active voice, not passive
        
        4. **EXAMPLES OF TRANSFORMATIONS**:
           ❌ Bad: "البرمجة بالذكاء الاصطناعي"
           ✅ Good: "كيف تتعلم البرمجة بالذكاء الاصطناعي في 2026؟ دليلك الشامل"
           
           ❌ Bad: "التسويق الرقمي"
           ✅ Good: "5 أسرار التسويق الرقمي التي لا يخبرك بها أحد"
           
           ❌ Bad: "تطوير المواقع"
           ✅ Good: "من الصفر للاحتراف: رحلتك في تطوير المواقع الإلكترونية"
        
        🚫 AVOID:
        - Generic, boring titles
        - Clickbait lies (be honest but compelling)
        - Excessive emojis
        - Too long titles (max 70 chars)
        
        📝 OUTPUT:
        Return ONLY the improved title as plain Arabic text. No quotes, no explanations, just the title.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const improvedTitle = response.text().trim().replace(/^["']|["']$/g, '');

        return NextResponse.json({ improvedTitle });

    } catch (error: any) {
        console.error("Title Enhance Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
