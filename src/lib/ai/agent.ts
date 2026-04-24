import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiTools, toolHandlers } from "./tools";
import { getAiConfig } from "./config";
import { STRICT_INSTRUCTION } from "./instructions";
import { addDoc, collection, serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { FunctionCall } from "@google/generative-ai";

interface AiConfig {
    modelName?: string;
    prompt?: string;
    stylePrompt?: string;
    groqKey?: string;
    openRouterKey?: string;
}

interface UserContext {
    name?: string;
    [key: string]: unknown;
}

interface ChatMessage {
    role: string;
    text?: string;
    parts?: Array<{ text?: string }>;
    content?: string;
}

interface ToolResponse {
    functionResponse: {
        name: string;
        response: { result: unknown };
    };
}

/**
 * The AI Agent Orchestrator
 * Handles Role, RAG, Tools, and Failovers
 */
export class AiAgent {
    private genAI: GoogleGenerativeAI;
    private config: AiConfig;

    constructor(apiKey: string, config: AiConfig) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.config = config;
    }

    async run(message: string, chatHistory: ChatMessage[], userContext?: UserContext, sessionId?: string) {
        try {
            // 1. RAG Discovery
            const ragContext = await this.getRagContext(message);

            // 2. Build Instructions
            const finalInstruction = this.buildInstruction(ragContext, userContext);

            // 3. Initialize Model with Tools
            const model = this.genAI.getGenerativeModel({
                model: this.config.modelName || "gemini-2.5-flash",
                tools: [{ 
                    // @ts-ignore
                    functionDeclarations: aiTools 
                }]
            });

            // 4. Start Chat Session
            const chat = model.startChat({
                history: this.sanitizeHistory(chatHistory),
                systemInstruction: {
                    role: "system",
                    parts: [{ text: finalInstruction }]
                },
            });

            // 5. Agentic Loop (Tools Execution)
            let result = await chat.sendMessage(message);
            let response = result.response;
            let toolCalls = response.functionCalls();

            let iterations = 0;
            while (toolCalls && toolCalls.length > 0 && iterations < 3) {
                iterations++;
                const toolResponses = await this.executeTools(toolCalls);
                if (toolResponses.length > 0) {
                    result = await chat.sendMessage(toolResponses);
                    response = result.response;
                    toolCalls = response.functionCalls();
                } else break;
            }

            let text = response.text();

            // 6. Post-Processing (Leads & Sessions)
            await this.handleLeadCapture(text, userContext);
            if (sessionId) await this.logSession(sessionId, message, text, userContext);

            return { response: text };

        } catch (error) {
            console.error("AI Agent Execution Failed:", error);
            return await this.runFailover(message, chatHistory);
        }
    }

    private buildInstruction(rag: string, ctx?: UserContext) {
        return STRICT_INSTRUCTION + 
               "\n\n[ADMIN]:\n" + (this.config.prompt || "") + 
               "\n\n[STYLE]:\n" + (this.config.stylePrompt || "") + 
               rag + 
               (ctx ? `\n\n[CONTEXT]: Speaking to: ${ctx.name || "Guest"}` : "");
    }

    private async executeTools(calls: FunctionCall[]) {
        const responses: ToolResponse[] = [];
        for (const call of calls) {
            // @ts-ignore
            const handler = toolHandlers[call.name as keyof typeof toolHandlers];
            if (handler) {
                // @ts-ignore
                const res = await handler(call.args);
                responses.push({ functionResponse: { name: call.name, response: { result: res } } });
            }
        }
        return responses;
    }

    private async getRagContext(query: string) {
        try {
            const results = await toolHandlers.search_knowledge_base({ query });
            if (!results?.length) return "";
            return "\n\n[REAL-TIME DATA]:\n" + results.map(r => `- ${r.type}: ${r.title || "Info"}`).join("\n");
        } catch { return ""; }
    }

    private sanitizeHistory(history: ChatMessage[]) {
        return history.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.parts?.[0]?.text || m.text || "" }]
        })).filter(m => m.parts[0].text);
    }

    private async handleLeadCapture(text: string, ctx?: UserContext) {
        const match = text.match(/\[\[LEAD_DATA:({[\s\S]*?})\]\]/);
        if (match?.[1]) {
            try {
                const data = JSON.parse(match[1]);
                await addDoc(collection(db, "leads"), { ...data, capturedAt: serverTimestamp(), userId: ctx?.name || "Anonymous" });
            } catch {}
        }
    }

    private async logSession(sid: string, msg: string, resp: string, ctx?: UserContext) {
        try {
            const docRef = doc(db, "chat_sessions", sid);
            const snap = await getDoc(docRef);
            let messages: any[] = snap.exists() ? (snap.data().messages || []) : [];
            
            messages.push({ role: 'user', text: msg, timestamp: new Date() });
            messages.push({ role: 'model', text: resp, timestamp: new Date() });
            
            // Limit to 100 messages to prevent document size exhaustion (1MB max)
            if (messages.length > 100) messages = messages.slice(messages.length - 100);

            await setDoc(docRef, {
                lastMessageAt: serverTimestamp(),
                messages
            }, { merge: true });
        } catch (e) { console.error("Session Log Error:", e); }
    }

    /**
     * Failover Logic for Reliability
     */
    private async runFailover(message: string, history: ChatMessage[]) {
        const providers = [
            { url: "https://api.groq.com/openai/v1/chat/completions", key: this.config.groqKey, model: "llama-3.3-70b-versatile" },
            { url: "https://openrouter.ai/api/v1/chat/completions", key: this.config.openRouterKey, model: "google/gemini-2.0-flash-exp:free" }
        ];

        const instruction = this.buildInstruction("", { name: "Guest" });
        const fallbackMsgs = [
            { role: "system", content: instruction },
            ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text || "" })),
            { role: "user", content: message }
        ];

        for (const p of providers) {
            if (!p.key) continue;
            try {
                const res = await fetch(p.url, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${p.key}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ model: p.model, messages: fallbackMsgs })
                });
                if (res.ok) {
                    const data = await res.json();
                    return { response: data.choices[0]?.message?.content || "Backup logic failed." };
                }
            } catch {}
        }
        return { error: "Extreme system failure across all AI providers." };
    }
}
