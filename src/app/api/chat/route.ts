import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { message, history, userContext, sessionId } = await req.json();
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

        // 2. Determine Candidate Models (Configured -> Discovery List)
        let candidateModels: string[] = [];

        if (preferredModel) {
            candidateModels.push(preferredModel);
        }

        // Always fetch available models as backup/primary
        try {
            const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const modelsRes = await fetch(modelsUrl);

            if (modelsRes.ok) {
                const modelsData = await modelsRes.json();

                // Filter for valid content generation models
                // Sort to put stable/standard models first (e.g. 1.5-flash) to avoid bleeding-edge quirks if desired,
                // BUT user wants auto-updates. Let's just gather them.
                // We'll prioritize 'flash' models for speed, then others.
                const allGeminis = modelsData.models?.filter((m: any) =>
                    m.name.includes("gemini") &&
                    m.supportedGenerationMethods?.includes("generateContent")
                ) || [];

                const flashModels = allGeminis.filter((m: any) => m.name.includes("flash"));
                const otherModels = allGeminis.filter((m: any) => !m.name.includes("flash"));

                // Add to candidates (avoiding duplicates if preferredModel appears)
                [...flashModels, ...otherModels].forEach(m => {
                    if (!candidateModels.includes(m.name)) {
                        candidateModels.push(m.name);
                    }
                });
            }
        } catch (e) {
            console.error("Model discovery failed:", e);
        }

        if (candidateModels.length === 0) {
            candidateModels.push("models/gemini-1.5-flash"); // Ultimate fallback
        }

        // 3. Initialize SDK & Execute with Retry Strategy
        const genAI = new GoogleGenerativeAI(apiKey);
        let text = "";
        let success = false;
        let lastError: any = null;

        // 4. Define System Instruction (Restored)
        const STRICT_INSTRUCTION = `
        IMPORTANT SYSTEM INSTRUCTIONS:
        1. ROLE & PERSONA: You are the Official Virtual Receptionist for 'Gamal.Dev' website.
           - Tone: Friendly, Playful, Polite, and Professional. Use emojis naturally (👋, 🚀, 💡).
           - Initiative: You proactively welcome visitors and guide them.
           - Constraint: You are NOT Gamal. Never imply you are him. Refer to him as "Gamal" or "Mr. Gamal".
           - Constraint: Never guess the user's name. Use "Sir/Madam" or "حضرتك" until they tell you.

        2. KNOWLEDGE BASE (Gamal's Profile):
           - Roles: Full Stack Web Developer, SEO Specialist, Data Analyst.
           - Tech Stack: Next.js, React, Tailwind CSS, Supabase, Firebase, Google Analytics, Search Console.
           - Data Tools: Power BI, SQL, Excel.
           - AI Integration: Expert in integrating Gemini AI into apps.
           - Services: Dynamic Websites, Dashboards, E-commerce Stores, SEO Optimization, AI Solutions.

        3. CONVERSATION FLOW (The Goal):
           a. WELCOME: Warmly welcome the user to the platform. Introduce Gamal's services briefly.
           b. IDENTIFY: Politely ask for the user's name to address them continuously.
           c. ENGAGE: Ask about their field or what brought them here.
           d. CONVERT: Encourage them to contact Gamal directly via the 'Contact Me' or 'WhatsApp' page for deals.

        4. LEAD GENERATION (CRITICAL BACKGROUND TASK):
           Your goal is to politely collect these details during the chat:
           - Name
           - Phone Number
           - Work Field / Industry
           - Desired Service
           
           As soon as you have collected ALL 4, append this hidden JSON block at the very end:
           [[LEAD_DATA:{"name": "...", "phone": "...", "field": "...", "service": "..."}]]
        
        5. RESTRICTIONS:
           - Do NOT provide code snippets.
           - Do NOT mention fake projects.
           - If asked about something outside your scope, polite apology and redirect to Gamal's services.
        `;

        let finalSystemInstruction = STRICT_INSTRUCTION + "\n\n[ADMIN CUSTOM INSTRUCTIONS]:\n" + systemPrompt;

        if (userContext) {
            finalSystemInstruction += `\n\n[USER CONTEXT]\nYou are speaking to: ${userContext.name || "Guest"}\nGender: ${userContext.gender || "Unknown"}\nIMPORTANT: Address the user appropriately based on their gender (e.g., "يا أستاذ" for Male, "يا أستاذة" for Female) if the language allows.`;
        }

        // Prepare History once
        let validHistory = Array.isArray(history) ? history : [];
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


        // Loop through candidates (Gemini)
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

        // ==========================================
        // FALLBACK PROVIDERS (If Gemini Fails)
        // ==========================================
        if (!success) {
            console.log("All Gemini models failed. Trying Fallback Providers...");

            // Helper to format history for OpenAI-like APIs (Groq, HF, OpenRouter)
            const openAyHistory = sanitizedHistory.map((m: any) => ({
                role: m.role === 'model' ? 'assistant' : 'user',
                content: m.parts[0].text
            }));

            // Add System Prompt
            openAyHistory.unshift({ role: "system", content: finalSystemInstruction });
            // Add Current Message
            openAyHistory.push({ role: "user", content: message });

            // 1. GROQ FALLBACK
            const groqKey = process.env.GROQ_API_KEY;
            if (groqKey && !success) {
                try {
                    console.log("Attempting Groq (Llama 3)...");
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
                        text = data.choices[0]?.message?.content || "";
                        if (text) success = true;
                    } else {
                        console.error("Groq Failed:", await res.text());
                    }
                } catch (e) { console.error("Groq Error:", e); }
            }

            // 2. HUGGING FACE FALLBACK
            const hfToken = process.env.HF_TOKEN;
            if (hfToken && !success) {
                try {
                    console.log("Attempting Hugging Face (Qwen)...");
                    // Using Qwen/Qwen2.5-72B-Instruct or similar reliable model
                    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${hfToken}`, "Content-Type": "application/json" },
                        body: JSON.stringify({
                            model: "Qwen/Qwen2.5-72B-Instruct",
                            messages: openAyHistory,
                            max_tokens: 1024
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        text = data.choices[0]?.message?.content || "";
                        if (text) success = true;
                    } else {
                        console.error("HF Failed:", await res.text());
                    }
                } catch (e) { console.error("HF Error:", e); }
            }

            // 3. OPENROUTER FALLBACK
            const orKey = process.env.OPENROUTER_API_KEY;
            if (orKey && !success) {
                try {
                    console.log("Attempting OpenRouter (Gemini Flash)...");
                    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${orKey}`,
                            "Content-Type": "application/json",
                            "HTTP-Referer": "https://gamal.dev",
                        },
                        body: JSON.stringify({
                            model: "google/gemini-2.0-flash-exp:free",
                            messages: openAyHistory
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        text = data.choices[0]?.message?.content || "";
                        if (text) success = true;
                    }
                } catch (e) { console.error("OpenRouter Error:", e); }
            }
        }

        if (!success) {
            throw lastError || new Error("All AI providers (Gemini, Groq, HF, OpenRouter) failed.");
        }

        // 5. Detect and Process Lead Data
        const leadRegex = /\[\[LEAD_DATA:({[\s\S]*?})\]\]/;
        const match = text.match(leadRegex);

        if (match && match[1]) {
            try {
                const leadData = JSON.parse(match[1]);
                console.log("Lead Captured:", leadData);

                // Save to Firestore 'leads' collection
                const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
                await addDoc(collection(db, "leads"), {
                    ...leadData,
                    capturedAt: serverTimestamp(),
                    source: "ai_chat",
                    userId: userContext?.name !== "Guest" ? userContext.name : "Anonymous"
                });

                // Remove the JSON block from the response sent to the user
                text = text.replace(match[0], "").trim();

            } catch (jsonError) {
                console.error("Failed to parse/save lead data:", jsonError);
            }
        }

        // 6. ARCHIVE CHAT LOG (New Feature)
        if (sessionId) {
            try {
                const { setDoc, doc, arrayUnion, serverTimestamp } = await import("firebase/firestore");
                const sessionRef = doc(db, "chat_sessions", sessionId);

                const userMsgObj = { role: 'user', text: message, timestamp: new Date() };
                const modelMsgObj = { role: 'model', text: text, timestamp: new Date() }; // Use processed text

                await setDoc(sessionRef, {
                    sessionId,
                    userId: userContext?.name || "Anonymous",
                    userContext, // Save full context (gender etc)
                    lastMessageAt: serverTimestamp(),
                    preview: text.substring(0, 100),
                    messages: arrayUnion(userMsgObj, modelMsgObj),
                    startedAt: serverTimestamp() // Set only if new (merge logic handles this poorly without set, but good enough for now, creates if missing) or we can use separate update
                }, { merge: true });

            } catch (archiveError) {
                console.error("Chat Archiving Failed:", archiveError);
            }
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
