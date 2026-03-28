import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, addDoc, collection, serverTimestamp, setDoc, arrayUnion } from "firebase/firestore";
import { discoverModels } from "@/lib/ai/models";
import { getAiConfig, AiConfig } from "@/lib/ai/config";
import { aiTools, toolHandlers } from "@/lib/ai/tools";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    let body: any;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { message, history, userContext, sessionId } = body;
    const chatHistory = Array.isArray(history) ? history : [];

    try {
        // 1. Fetch Configuration & Discover Model
        const config = await getAiConfig();
        const apiKey = config.geminiKey;

        if (!apiKey) {
            throw new Error("Gemini API Key is missing.");
        }

        const candidateModels = await discoverModels(apiKey, config.modelName);
        const selectedModelName = candidateModels[0] || "gemini-1.5-flash";

        // 2. RAG STEP (Information Layer)
        let ragContext = "";
        try {
            const searchResults = await toolHandlers.search_knowledge_base({ query: message });
            if (searchResults && searchResults.length > 0) {
                ragContext = "\n\n[REAL-TIME DATA]:\n" + 
                    searchResults.map(r => `- ${r.type.toUpperCase()}: ${r.title || r.content?.title || "Info"}: ${r.content?.description || ""}`).join("\n");
            }
        } catch (e) {
            console.error("RAG search failed:", e);
        }

        // 3. Assemble Final Agentic Instruction
        const finalSystemInstruction = 
            (config.systemRole || "") + 
            "\n\n[INSTRUCTIONS]:\n" + (config.prompt || "") + 
            "\n\n[STYLE & NUANCE]:\n" + (config.stylePrompt || "") + 
            ragContext +
            (userContext ? `\n\n[USER CONTEXT]: Speaking to: ${userContext.name || "Guest"}, Gender: ${userContext.gender || "Unknown"}` : "");

        // 4. Sanitize History
        const sanitizedHistory = chatHistory.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.parts?.[0]?.text || m.text || "" }]
        })).filter(m => m.parts[0].text);

        // 5. Initialize SDK with Tools
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: selectedModelName,
            tools: [{ 
                // @ts-ignore
                functionDeclarations: aiTools 
            }]
        });

        const chat = model.startChat({
            history: sanitizedHistory,
            systemInstruction: {
                role: "system",
                parts: [{ text: finalSystemInstruction }]
            },
        });

        // 6. Send Message & Handle Tool Calls (The Agentic Loop)
        let result = await chat.sendMessage(message);
        let response = result.response;
        let toolCalls = response.functionCalls();

        let iterations = 0;
        while (toolCalls && toolCalls.length > 0 && iterations < 3) {
            iterations++;
            const toolResponses: any[] = [];
            for (const call of toolCalls) {
                const handler = (toolHandlers as any)[call.name];
                if (handler) {
                    console.log(`🤖 AI AGENT EXECUTING TOOL: ${call.name}`, call.args);
                    const toolResult = await handler(call.args);
                    toolResponses.push({
                        functionResponse: {
                            name: call.name,
                            response: { result: toolResult }
                        }
                    });
                }
            }
            if (toolResponses.length > 0) {
                result = await chat.sendMessage(toolResponses);
                response = result.response;
                toolCalls = response.functionCalls();
            } else {
                break;
            }
        }

        let text = response.text();

        // 7. Detect Lead Data
        const leadRegex = /\[\[LEAD_DATA:({[\s\S]*?})\]\]/;
        const match = text.match(leadRegex);
        if (match && match[1]) {
            try {
                const leadData = JSON.parse(match[1]);
                await addDoc(collection(db, "leads"), {
                    ...leadData,
                    capturedAt: serverTimestamp(),
                    source: "ai_agent_v3",
                    userId: userContext?.name || "Anonymous"
                });
                text = text.replace(match[0], "").trim();
            } catch (e) { console.error("Lead parsing error:", e); }
        }

        // 8. Session Management
        if (sessionId) {
            try {
                await setDoc(doc(db, "chat_sessions", sessionId), {
                    sessionId,
                    userId: userContext?.name || "Anonymous",
                    lastMessageAt: serverTimestamp(),
                    preview: text.substring(0, 100),
                    messages: arrayUnion(
                        { role: 'user', text: message, timestamp: new Date() },
                        { role: 'model', text, timestamp: new Date() }
                    )
                }, { merge: true });
            } catch (e) { console.error("Session saving error:", e); }
        }

        return NextResponse.json({ response: text });

    } catch (error: any) {
        console.error("Gemini Agentic Flow Failed. Attempting Cross-Provider Failover...", error);
        
        try {
            const config = await getAiConfig();
            const fallbackMessages = [
                { role: "system", content: "You are a professional assistant for Gamal.Dev. Answer precisely and politely. Tone: Professional." },
                ...chatHistory.map((m: any) => ({
                    role: m.role === 'model' ? 'assistant' : 'user',
                    content: m.parts?.[0]?.text || m.text || ""
                })),
                { role: "user", content: message }
            ];

            // Try Groq
            if (config.groqKey) {
                const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${config.groqKey}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: fallbackMessages
                    })
                });
                if (groqRes.ok) {
                    const data = await groqRes.json();
                    return NextResponse.json({ response: data.choices[0]?.message?.content || "عذراً، حدث خطأ، سأكون قادراً على مساعدتك قريباً." });
                }
            }

            // Try OpenRouter
            if (config.openRouterKey) {
                const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${config.openRouterKey}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "google/gemini-2.0-flash-exp:free",
                        messages: fallbackMessages
                    })
                });
                if (orRes.ok) {
                    const data = await orRes.json();
                    return NextResponse.json({ response: data.choices[0]?.message?.content || "عذراً، جارٍ المعالجة..." });
                }
            }

            return NextResponse.json({ error: "All AI providers failed." }, { status: 500 });
        } catch (e) {
            return NextResponse.json({ error: "Critical Failover Error" }, { status: 500 });
        }
    }
}
