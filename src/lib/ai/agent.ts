import { GoogleGenerativeAI, FunctionCall } from "@google/generative-ai";
import { aiTools, toolHandlers } from "./tools";
import { STRICT_INSTRUCTION } from "./instructions";
import { logSession } from "./utils/sessionManager";
import { handleLeadCapture } from "./utils/leadManager";
import { getRagContext } from "./utils/ragManager";
import { runFailover, type ChatMessage } from "./utils/failoverManager";

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
            const ragContext = await getRagContext(message);

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
            await handleLeadCapture(text, userContext?.name);
            if (sessionId) await logSession(sessionId, message, text);

            return { response: text };

        } catch (error) {
            console.error("AI Agent Execution Failed:", error);
            const instruction = this.buildInstruction("", { name: userContext?.name || "Guest" });
            return await runFailover(message, chatHistory, instruction, this.config.groqKey, this.config.openRouterKey);
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

    private sanitizeHistory(history: ChatMessage[]) {
        return history.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.parts?.[0]?.text || m.text || "" }]
        })).filter(m => m.parts[0].text);
    }
}
