import { FlowDefinition } from "../types";

export const hostingFlow: FlowDefinition = {
    id: "HOSTING_DOMAIN",
    priority: 190,
    basePersona: "SALES",
    keywords: ['استضافة', 'سيرفر', 'دومين', 'هوست', 'aws', 'vercel', 'hosting', 'domain'],
    getPrompt: () => `\n[FLOW: hosting]\nWe provide cloud hosting like Vercel and assist with domains.\n`
};
