import { FlowDefinition } from "../types";

export const languageFlow: FlowDefinition = {
    id: "LANGUAGE_SUPPORT",
    priority: 240,
    basePersona: "SALES",
    keywords: ['لغتين', 'انجليزي وعربي', 'ترجمة', 'لغات', 'rtl', 'ltr'],
    getPrompt: () => `\n[FLOW: language]\nOur systems fully support multiple languages.\n`
};
