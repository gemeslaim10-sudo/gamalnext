import { FlowDefinition } from "../types";

export const urgentFlow: FlowDefinition = {
    id: "URGENT",
    priority: 60,
    basePersona: "SALES",
    keywords: ['بسرعة', 'مستعجل', 'اقرب وقت', 'طوارئ', 'ضروري', 'حالا', 'امبارح'],
    getPrompt: () => `\n[FLOW: urgent]\nAssure them we are fast, but high quality takes time.\n`
};
