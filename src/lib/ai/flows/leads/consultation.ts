import { FlowDefinition } from "../types";

export const consultationFlow: FlowDefinition = {
    id: "CONSULTATION",
    priority: 350,
    basePersona: "SALES",
    keywords: ['استشارة', 'مشروع', 'مساعدة', 'عايز اعمل', 'ابني', 'فكرة'],
    getPrompt: () => `\n[FLOW: consultation]\nDirect them to schedule a consultation call with Gamal.\n`
};
