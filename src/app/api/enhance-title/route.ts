import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getAiConfig } from "@/lib/ai/config";
import { discoverModels } from "@/lib/ai/models";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { title } = await req.json();

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const config = await getAiConfig();
        const apiKey = config.geminiKey;
        
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API Key missing in dashboard/env" }, { status: 500 });
        }

        // 1. Discover Best Available Models
        const candidateModels = await discoverModels(apiKey, config.modelName);
        const selectedModelName = candidateModels[0] || "gemini-1.5-flash";

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
