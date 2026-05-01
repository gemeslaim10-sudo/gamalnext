import { FlowDefinition } from "../types";

export const analyticsFlow: FlowDefinition = {
    id: "ANALYTICS_TRACKING",
    priority: 280,
    basePersona: "SALES",
    keywords: ['بيكسل', 'تتبع', 'اناليتكس', 'بيكسل فيسبوك', 'جوجل اناليتكس', 'pixel', 'analytics'],
    getPrompt: () => `\n[FLOW: analytics]\nWe integrate Google Analytics and Facebook Pixel for precise tracking.\n`
};
