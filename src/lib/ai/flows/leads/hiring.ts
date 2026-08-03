import { FlowDefinition } from "../types";

export const hiringFlow: FlowDefinition = {
    id: "HIRING_SEEKER",
    priority: 290,
    basePersona: "SALES",
    keywords: ['شغل', 'تدريب', 'اشتغل معاكم', 'توظيف', 'cv', 'وظيفة', 'انترفيو', 'internship'],
    match: msg => msg.includes('عايز') || msg.includes('ابعت'),
    getPrompt: () => `\n[FLOW: hiring]\nWe welcome talent. Ask them to leave their CV.\n`
};
