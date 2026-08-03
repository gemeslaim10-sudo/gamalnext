import { FlowDefinition } from "../types";

export const seoFlow: FlowDefinition = {
    id: "SEO_SPECIFIC",
    priority: 160,
    basePersona: "SALES",
    keywords: ['جوجل', 'بحث', 'ترتيب', 'كلمات مفتاحية', 'ارشفة', 'seo'],
    match: msg => !msg.includes('تسويق'),
    getPrompt: () => `\n[FLOW: seo]\nConfirm that our Next.js websites easily rank on Google.\n`
};
