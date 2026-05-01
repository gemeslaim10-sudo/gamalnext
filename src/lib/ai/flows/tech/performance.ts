import { FlowDefinition } from "../types";

export const performanceFlow: FlowDefinition = {
    id: "PERFORMANCE_SPECIFIC",
    priority: 170,
    basePersona: "SALES",
    keywords: ['سرعة', 'بطيء', 'lighthouse', 'تقيل', 'بيحمل ببطء'],
    getPrompt: () => `\n[FLOW: performance]\nOur websites hit 100/100 on Lighthouse to boost sales.\n`
};
