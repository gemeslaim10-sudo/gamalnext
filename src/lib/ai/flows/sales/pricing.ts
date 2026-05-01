import { FlowDefinition } from "../types";

export const pricingFlow: FlowDefinition = {
    id: "PRICING",
    priority: 110,
    basePersona: "SALES",
    keywords: ['بكام', 'سعر', 'تكلفة', 'ميزانية', 'تكلف', 'حساب', 'price', 'cost'],
    getPrompt: () => `\n[FLOW: pricing]\nAsk for more details about the project to give an accurate price.\n`
};
