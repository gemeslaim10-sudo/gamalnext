import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { message, history, userContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Missing Gemini API Key in environment variables.");
            return NextResponse.json({ error: "Configuration Error: Gemini API Key is missing." }, { status: 500 });
        }

        // 1. Fetch System Prompt & Preferred Model from Firestore
        let systemPrompt = "You are a helpful AI assistant.";
        let preferredModel = "";

        try {
            const aiDoc = await getDoc(doc(db, "settings", "ai"));
            if (aiDoc.exists()) {
                const data = aiDoc.data();
                if (data.prompt) systemPrompt = data.prompt;
                if (data.modelName) preferredModel = data.modelName;
            }
        } catch (error) {
            console.error("Firestore Error (fetching settings):", error);
            // Continue with defaults if DB fails
        }

        // 2. Determine Model (Configured vs Discovery)
        let selectedModelName = preferredModel;

        // Note: We intentionally avoid hardcoding a fallback like "gemini-1.5-flash" here.
        // If no model is set in Firestore, we ask Google's API for what's available.

        if (!selectedModelName) {
            try {
                // Fetch available models from Google
                const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                const modelsRes = await fetch(modelsUrl);

                if (!modelsRes.ok) {
                    const errText = await modelsRes.text();
                    console.error(`Google API Error (List Models): ${modelsRes.status} - ${errText}`);
                    throw new Error(`Failed to list models from Google API: ${modelsRes.status}`);
                }

                const modelsData = await modelsRes.json();

                // Look for the newest 'gemini' model that supports generating content
                // Prioritize 'gemini-1.5' family if available, else any gemini.
                const validModels = modelsData.models?.filter((m: any) =>
                    m.name.includes("gemini") &&
                    m.supportedGenerationMethods?.includes("generateContent")
                );

                if (!validModels || validModels.length === 0) {
                    throw new Error("No Gemini models found in user's API access list.");
                }

                // Sort/Select strategy: Prefer 'flash' models for speed/cost if available, else take the first one.
                // Or just take the first one as they usually list latest first or we can trust the filter.
                // Let's look for one with 'flash' in the name, if not, then 'pro', else first.
                const flashModel = validModels.find((m: any) => m.name.includes("flash"));
                const selected = flashModel || validModels[0];

                // The name field is usually "models/gemini-1.5-flash-002" etc.
                // The SDK accepts "models/..." or just the ID. We'll use the name as returned.
                selectedModelName = selected.name;

                console.log(`Auto-detected Model: ${selectedModelName}`);

            } catch (discoveryError: any) {
                console.error("Model Discovery Failed:", discoveryError);
                return NextResponse.json({
                    error: "AI Model Discovery Failed",
                    details: discoveryError.message
                }, { status: 500 });
            }
        }

        if (!selectedModelName) {
            return NextResponse.json({ error: "No AI model selected or discovered." }, { status: 500 });
        }

        // 3. Initialize SDK
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: selectedModelName });

        // 4. Generate Content
        // Context Instruction
        let contextInstruction = "";
        if (userContext) {
            contextInstruction = `\n\n[USER CONTEXT]\nYou are speaking to: ${userContext.name || "Guest"}\nGender: ${userContext.gender || "Unknown"}\nIMPORTANT: Address the user appropriately based on their gender (e.g., "يا أستاذ" for Male, "يا أستاذة" for Female) if the language allows. If gender is unknown, be neutral.`;
            systemPrompt += contextInstruction;
        }

        const chat = model.startChat({
            history: history || [],
            systemInstruction: {
                role: "system",
                parts: [{ text: systemPrompt }]
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });

    } catch (error: any) {
        console.error("AI Chat Execution Error:", error);
        return NextResponse.json({
            error: `AI Error: ${error.message || "Unknown error"}`,
            details: JSON.stringify(error, Object.getOwnPropertyNames(error))
        }, { status: 500 });
    }
}
