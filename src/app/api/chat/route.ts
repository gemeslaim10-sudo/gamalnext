import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp, setDoc, arrayUnion } from "firebase/firestore";
import { STRICT_INSTRUCTION } from "@/lib/ai/instructions";
import { discoverModels } from "@/lib/ai/models";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { message, history, userContext, sessionId } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Missing Gemini API Key in environment variables.");
            return NextResponse.json({ error: "Configuration Error: Gemini API Key is missing." }, { status: 500 });
        }

        // 1. Fetch AI Settings
        let customSystemPrompt = "You are a helpful AI assistant.";
        let preferredModel = "";

        try {
            const aiDoc = await getDoc(doc(db, "settings", "ai"));
            if (aiDoc.exists()) {
                const data = aiDoc.data();
                if (data.prompt) customSystemPrompt = data.prompt;
                if (data.modelName) preferredModel = data.modelName;
            }
        } catch (error) {
            console.error("Firestore Error (fetching settings):", error);
        }

        // 2. Discover Best Available Models
        const candidateModels = await discoverModels(apiKey, preferredModel);

        // 3. Prepare Final System Instructions
        let finalSystemInstruction = STRICT_INSTRUCTION + "\n\n[ADMIN CUSTOM INSTRUCTIONS]:\n" + customSystemPrompt;

        if (userContext) {
            finalSystemInstruction += `\n\n[USER CONTEXT]\nYou are speaking to: ${userContext.name || "Guest"}\nGender: ${userContext.gender || "Unknown"}\nIMPORTANT: Address the user appropriately based on their gender (e.g., "يا أستاذ" for Male, "يا أستاذة" for Female) if the language allows.`;
        }

        // 4. Sanitize and Prepare History
        const validHistory = Array.isArray(history) ? history : [];
        const sanitizedHistory: any[] = [];
        let foundFirstUser = false;
        for (const msg of validHistory) {
            if (!foundFirstUser && msg.role === 'model') continue;
            if (msg.role === 'user') foundFirstUser = true;
            if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === msg.role) continue;
            sanitizedHistory.push(msg);
        }
        if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
            sanitizedHistory.pop();
        }

        // 5. Initialize SDK & Execute with Retry Strategy
        const genAI = new GoogleGenerativeAI(apiKey);
        let text = "";
        let success = false;
        let lastError: any = null;

        for (const modelName of candidateModels) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const chat = model.startChat({
                    history: sanitizedHistory,
                    systemInstruction: {
                        role: "system",
                        parts: [{ text: finalSystemInstruction }]
                    },
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                text = response.text();

                if (text) {
                    success = true;
                    console.log(`Success with Gemini model: ${modelName}`);
                    break;
                }
            } catch (error: any) {
                lastError = error;
                console.warn(`Failed with Gemini model ${modelName}: ${error.message?.substring(0, 100)}...`);
                continue;
            }
        }

        // 6. Fallback Strategy (Groq, HF, OpenRouter)
        if (!success) {
            text = await handleFallbacks(message, sanitizedHistory, finalSystemInstruction);
            if (text) success = true;
        }

        if (!success) {
            throw lastError || new Error("All AI providers (Gemini, Groq, HF, OpenRouter) failed.");
        }

        // 7. Detect Lead Data
        const leadRegex = /\[\[LEAD_DATA:({[\s\S]*?})\]\]/;
        const match = text.match(leadRegex);

        if (match && match[1]) {
            try {
                const leadData = JSON.parse(match[1]);
                await addDoc(collection(db, "leads"), {
                    ...leadData,
                    capturedAt: serverTimestamp(),
                    source: "ai_chat",
                    userId: userContext?.name !== "Guest" ? userContext.name : "Anonymous"
                });
                text = text.replace(match[0], "").trim();
            } catch (e) { console.error("Lead parsing error:", e); }
        }

        // 8. Archive Session
        if (sessionId) {
            try {
                const sessionRef = doc(db, "chat_sessions", sessionId);
                await setDoc(sessionRef, {
                    sessionId,
                    userId: userContext?.name || "Anonymous",
                    userContext,
                    lastMessageAt: serverTimestamp(),
                    preview: text.substring(0, 100),
                    messages: arrayUnion(
                        { role: 'user', text: message, timestamp: new Date() },
                        { role: 'model', text, timestamp: new Date() }
                    ),
                    startedAt: serverTimestamp()
                }, { merge: true });
            } catch (e) { console.error("Archiving error:", e); }
        }

        return NextResponse.json({ response: text });

    } catch (error: any) {
        console.error("AI Chat Execution Error:", error);
        return NextResponse.json({
            error: `AI Error: ${error.message || "Unknown error"}`,
            details: JSON.stringify(error, Object.getOwnPropertyNames(error))
        }, { status: 500 });
    }
}

async function handleFallbacks(message: string, sanitizedHistory: any[], finalSystemInstruction: string): Promise<string> {
    const openAyHistory = [
        { role: "system", content: finalSystemInstruction },
        ...sanitizedHistory.map((m: any) => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.parts[0].text
        })),
        { role: "user", content: message }
    ];

    // 1. GROQ
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: openAyHistory,
                    max_tokens: 1024
                })
            });
            if (res.ok) {
                const data = await res.json();
                return data.choices[0]?.message?.content || "";
            }
        } catch (e) { console.error("Groq Error:", e); }
    }

    // 2. OpenRouter
    const orKey = process.env.OPENROUTER_API_KEY;
    if (orKey) {
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${orKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://gamaltech.info" },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-exp:free",
                    messages: openAyHistory
                })
            });
            if (res.ok) {
                const data = await res.json();
                return data.choices[0]?.message?.content || "";
            }
        } catch (e) { console.error("OpenRouter Error:", e); }
    }

    return "";
}
