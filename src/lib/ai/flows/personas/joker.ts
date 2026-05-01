import { FlowDefinition } from "../types";

export const jokerFlow: FlowDefinition = {
    id: "JOKER",
    priority: 140,
    basePersona: "JOKER",
    keywords: ['نكتة', 'هزار', 'اضحك', 'حلوة', 'هههه'],
    getPrompt: () => `\n[FLOW: joker]\nTell a short joke then politely return to business.\n`
};
