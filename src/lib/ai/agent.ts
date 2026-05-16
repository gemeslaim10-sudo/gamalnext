import { GoogleGenerativeAI, FunctionCall } from "@google/generative-ai";
import { aiTools, toolHandlers } from "./tools";
import { logSession } from "./utils/sessionManager";
import { handleLeadCapture } from "./utils/leadManager";
import { getRagContext } from "./utils/ragManager";
import { runFailover, type ChatMessage } from "./utils/failoverManager";
import { determineFlow } from "./flows/registry";
import { buildInstruction, sanitizeHistory } from "./utils/agentHelpers";
import { AiConfig, UserContext, ToolResponse } from "./types/agent";

export class AiAgent {
    private genAI: GoogleGenerativeAI;
    private config: AiConfig;

    constructor(apiKey: string, config: AiConfig) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.config = config;
    }

    async run(message: string, rawChatHistory: ChatMessage[], userContext?: UserContext, sessionId?: string) {
        const chatHistory = rawChatHistory.slice(-15);

        try {
            const ragContext = await getRagContext(message);
            const flow = determineFlow(message, chatHistory, userContext?.name);
            const finalInstruction = buildInstruction(message, chatHistory, ragContext, userContext, flow);

            const phoneRegex = /(?:\+|00)?\d{8,15}/;
            const phoneMatch = message.match(phoneRegex);
            
            if (phoneMatch) {
                try {
                    await handleLeadCapture(`[[LEAD_DATA:{"name": "${userContext?.name || 'Guest'}", "phone": "${phoneMatch[0]}", "activity": "${flow.id}", "service": "${flow.id}", "preferredTime": null}]]`, userContext?.uid, sessionId);
                } catch (e) {
                    console.error("Silent lead capture failed:", e);
                }
            }

            const model = this.genAI.getGenerativeModel({
                model: this.config.modelName || "gemini-2.5-flash",
                generationConfig: { temperature: 0.3 },
                tools: [{ functionDeclarations: aiTools }]
            });

            const chat = model.startChat({
                history: sanitizeHistory(chatHistory),
                systemInstruction: {
                    role: "system",
                    parts: [{ text: finalInstruction }]
                },
            });

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

            try {
                const leadStatus = await handleLeadCapture(text, userContext?.uid, sessionId);
                if (leadStatus === false) {
                    console.error("Failed to capture lead data from response.");
                }
                
                if (sessionId) {
                    await logSession(sessionId, message, text);
                }
            } catch (dbError) {
                console.error("Post-processing DB error:", dbError);
            }
            
            const cleanText = text.replace(/\[*LEAD_DATA\s*:\s*([\s\S]*?)(?:\]\]|\](?!\w))/ig, "").trim();

            return { response: cleanText };

        } catch (error) {
            console.error("AI Agent Execution Failed:", error);
            const instruction = buildInstruction(message, chatHistory, "", userContext);
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
                    if (leadStatus === false) console.error("Failed to capture lead data from failover response.");
                    if (sessionId) await logSession(sessionId, message, failoverText);
                } catch (dbError) {
                    console.error("Failover post-processing DB error:", dbError);
                }
                const cleanFailoverText = failoverText.replace(/\[*LEAD_DATA\s*:\s*([\s\S]*?)(?:\]\]|\](?!\w))/ig, "").trim();
                return { response: cleanFailoverText };
            }
            
            return failoverResult;
        }
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
}
