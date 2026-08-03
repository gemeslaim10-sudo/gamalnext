import { FlowDefinition } from "../types";

export const portfolioFlow: FlowDefinition = {
    id: "PORTFOLIO",
    priority: 370,
    basePersona: "SALES",
    keywords: ['اعمال', 'موقع', 'خدمات', 'شغل', 'تفاصيل', 'مشاريع'],
    getPrompt: () => `\n[FLOW: portfolio]\nConfidently direct them to the portfolio section on the website.\n`
};
