import { FlowDefinition } from "../types";

export const aiIntegrationFlow: FlowDefinition = {
    id: "AI_INTEGRATION",
    priority: 210,
    basePersona: "SALES",
    keywords: ['ذكاء اصطناعي', 'شات جي بي تي', 'ai', 'chatgpt', 'openai', 'gemini'],
    getPrompt: () => `\n[FLOW: aiIntegration]\nWe are experts in integrating OpenAI API and Gemini.\n`
};
