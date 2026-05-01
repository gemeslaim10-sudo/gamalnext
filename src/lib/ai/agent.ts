import { GoogleGenerativeAI, FunctionCall } from "@google/generative-ai";
import { aiTools, toolHandlers } from "./tools";
import { STRICT_INSTRUCTION } from "./instructions";
import { logSession } from "./utils/sessionManager";
import { handleLeadCapture } from "./utils/leadManager";
import { getRagContext } from "./utils/ragManager";
import { runFailover, type ChatMessage } from "./utils/failoverManager";
import { determineFlow } from "./flows/registry";
import { FlowDefinition } from "./flows/types";

interface AiConfig {
    modelName?: string;
    groqKey?: string;
    openRouterKey?: string;
    openaiKey?: string;
    huggingfaceKey?: string;
}

interface UserContext {
    name?: string;
    uid?: string;
    phone?: string;
    email?: string;
    gender?: string;
    [key: string]: unknown;
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

    async run(message: string, rawChatHistory: ChatMessage[], userContext?: UserContext, sessionId?: string) {
        // 0. Context Window Management (Sliding Window to prevent token bloat)
        const chatHistory = rawChatHistory.slice(-15);

        try {
            // 1. RAG Discovery
            const ragContext = await getRagContext(message);

            // 2. Build Instructions with Flow State
            const flow = determineFlow(message, chatHistory, userContext?.name);
            const finalInstruction = this.buildInstruction(message, chatHistory, ragContext, userContext, flow);

            // 2.5 SILENT LEAD CAPTURE (ROOT FIX)
            // If the user types a phone number, capture it immediately without relying on the AI.
            // Updated to support international and local numbers properly.
            const phoneRegex = /(?:\+|00)?\d{8,15}/;
            const phoneMatch = message.match(phoneRegex);
            
            if (phoneMatch) {
                try {
                    console.log("ROOT FIX: Auto-detected phone number from user input:", phoneMatch[0]);
                    await handleLeadCapture(`[[LEAD_DATA:{"name": "${userContext?.name || 'Guest'}", "phone": "${phoneMatch[0]}", "activity": "${flow.id}", "service": "${flow.id}", "preferredTime": null}]]`, userContext?.uid, sessionId);
                } catch (e) {
                    console.error("Silent lead capture failed:", e);
                }
            }

            // 3. Initialize Model with Tools
            const model = this.genAI.getGenerativeModel({
                model: this.config.modelName || "gemini-2.5-flash",
                generationConfig: {
                    temperature: 0.3,
                },
                tools: [{ 
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
            while (toolCalls && toolCalls.length > 0 && iterations < 10) {
                iterations++;
                const toolResponses = await this.executeTools(toolCalls);
                if (toolResponses.length > 0) {
                    result = await chat.sendMessage(toolResponses);
                    response = result.response;
                    toolCalls = response.functionCalls();
                } else break;
            }

            const text = response.text();

            // 6. Post-Processing (Leads & Sessions) - معزول عن الرد الأساسي
            try {
                const leadStatus = await handleLeadCapture(text, userContext?.uid, sessionId);
                if (leadStatus === false) {
                    console.error("⚠️ Failed to capture lead data from response.");
                }
                
                if (sessionId) {
                    await logSession(sessionId, message, text);
                }
            } catch (dbError) {
                console.warn("⚠️ تم الرد بنجاح ولكن فشل الحفظ في قاعدة البيانات:", dbError);
            }
            // 7. Clean the final text before sending to the client (remove the secret tag)
            const cleanText = text.replace(/\[*LEAD_DATA\s*:\s*([\s\S]*?)(?:\]\]|\](?!\w))/ig, "").trim();

            return { response: cleanText };

        } catch (error) {
            console.error("AI Agent Execution Failed:", error);
            const instruction = this.buildInstruction(message, chatHistory, "", userContext);
            const failoverResult = await runFailover(
                message, 
                chatHistory, 
                instruction, 
                this.config.groqKey, 
                this.config.openRouterKey,
                this.config.openaiKey,
                this.config.huggingfaceKey
            );
            
            if (failoverResult.response) {
                const failoverText = failoverResult.response;
                try {
                    const leadStatus = await handleLeadCapture(failoverText, userContext?.uid, sessionId);
                    if (leadStatus === false) {
                        console.error("⚠️ Failed to capture lead data from failover response.");
                    }
                    if (sessionId) {
                        await logSession(sessionId, message, failoverText);
                    }
                } catch (dbError) {
                    console.warn("⚠️ تم الرد بنجاح (طوارئ) ولكن فشل الحفظ في قاعدة البيانات:", dbError);
                }
                const cleanFailoverText = failoverText.replace(/\[*LEAD_DATA\s*:\s*([\s\S]*?)(?:\]\]|\](?!\w))/ig, "").trim();
                return { response: cleanFailoverText };
            }
            
            return failoverResult;
        }
    }

    private buildInstruction(currentMessage: string, history: ChatMessage[], rag: string, ctx?: UserContext, precomputedFlow?: FlowDefinition) {
        // Find the flow state first
        const flow = precomputedFlow || determineFlow(currentMessage, history, ctx?.name);
        const flowPrompt = flow.getPrompt(ctx?.name);
        const isGuest = !ctx?.name || ctx.name === 'Guest';

        let baseInstruction = "";
        
        if (flow.basePersona === 'INTIMATE') {
            baseInstruction = "[هويتك ودورك الأساسي]\nأنت المساعد الذكي لـ جمال عبد العاطي. لكن العميل الحالي هو صديق أو شخص مقرب جداً لجمال. إياك أن تتحدث كمندوب مبيعات أو تحاول بيع خدماته.\n\n";
        } else if (flow.basePersona === 'TROLL') {
            baseInstruction = "[هويتك ودورك الأساسي]\nأنت الآن في وضع (التحفيل). العميل داخل يتسلى أو بيهزر. ممنوع منعاً باتاً التحدث عن البيزنس أو الخدمات أو محاولة البيع.\n\n";
        } else {
            baseInstruction = STRICT_INSTRUCTION + "\n\n";
        }

        const contextInfo = !isGuest 
            ? `\n\n[CONTEXT]: بيانات العميل المسجلة في النظام:\nالاسم: ${ctx.name}\n${ctx?.phone ? `الهاتف: ${ctx.phone}\n` : ''}${ctx?.email ? `البريد: ${ctx.email}\n` : ''}`
            : "";

        return baseInstruction + flowPrompt + rag + contextInfo;
    }

    private async executeTools(calls: FunctionCall[]) {
        const responses: ToolResponse[] = [];
        for (const call of calls) {
            const rawHandler = toolHandlers[call.name as keyof typeof toolHandlers];
            if (rawHandler) {
                const handler = rawHandler as (args: unknown) => Promise<unknown>;
                const res = await handler(call.args);
                responses.push({ functionResponse: { name: call.name, response: { result: res } } });
            }
        }
        return responses;
    }

    private sanitizeHistory(history: ChatMessage[]) {
        const cleaned = history.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.parts?.[0]?.text || m.text || "" }]
        })).filter(m => m.parts[0].text);

        // Gemini requires strict user/model alternation — merge consecutive same-role messages
        const merged: typeof cleaned = [];
        for (const msg of cleaned) {
            const last = merged[merged.length - 1];
            if (last && last.role === msg.role) {
                last.parts[0].text += "\n" + msg.parts[0].text;
            } else {
                merged.push({ ...msg, parts: [{ text: msg.parts[0].text }] });
            }
        }

        // Gemini requires history to start with 'user' — strip leading 'model' messages
        while (merged.length > 0 && merged[0].role === 'model') {
            merged.shift();
        }

        return merged;
    }
}
