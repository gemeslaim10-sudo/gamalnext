import { FlowDefinition } from "../types";

export const ecommerceFlow: FlowDefinition = {
    id: "ECOMMERCE",
    priority: 330,
    basePersona: "SALES",
    keywords: ['شوبيفاي', 'منتجات', 'بوابات دفع', 'متجر', 'دروبشيبينج', 'shopify', 'ecommerce'],
    getPrompt: () => `\n[FLOW: ecommerce]\nWe build Shopify or Custom Next.js stores based on business size.\n`
};
