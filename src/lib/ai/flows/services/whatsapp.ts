import { FlowDefinition } from "../types";

export const whatsappFlow: FlowDefinition = {
    id: "WHATSAPP_AUTOMATION",
    priority: 320,
    basePersona: "SALES",
    keywords: ['واتساب', 'بوت واتساب', 'api واتساب', 'رد الي', 'whatsapp'],
    getPrompt: () => `\n[FLOW: whatsapp]\nWe program WhatsApp bots for auto-replies and sales boosts.\n`
};
