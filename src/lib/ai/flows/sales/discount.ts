import { FlowDefinition } from "../types";

export const discountFlow: FlowDefinition = {
    id: "DISCOUNT_SEEKER",
    priority: 100,
    basePersona: "SALES",
    keywords: ['خصم', 'اوكازيون', 'تخفيض', 'ببلاش', 'غلبان', 'ارخص شوية', 'نزل في السعر'],
    getPrompt: () => `\n[FLOW: discount]\nWe do not compromise on quality. We can reduce features to lower the cost.\n`
};
