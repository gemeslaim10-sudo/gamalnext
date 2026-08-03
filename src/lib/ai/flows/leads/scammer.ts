import { FlowDefinition } from "../types";

export const scammerFlow: FlowDefinition = {
    id: "SCAMMER",
    priority: 50,
    basePersona: "SALES",
    keywords: ['تسويق', 'seo', 'اعلانات', 'متابعين', 'لايكات', 'سبونسر', 'marketing', 'followers'],
    match: msg => msg.includes('خدمات') || msg.includes('شركة'),
    getPrompt: () => `\n[FLOW: scammer]\nPolitely reject the offer and end the conversation.\n`
};
