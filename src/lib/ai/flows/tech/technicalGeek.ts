import { FlowDefinition } from "../types";

export const technicalGeekFlow: FlowDefinition = {
    id: "TECHNICAL_GEEK",
    priority: 310,
    basePersona: "SALES",
    keywords: ['react', 'next.js', 'node', 'api', 'داتا بيز', 'ssr', 'database', 'typescript', 'tailwind'],
    getPrompt: () => `\n[FLOW: technicalGeek]\nSpeak using technical terms (SSR, Tailwind, Prisma) like a fellow developer.\n`
};
