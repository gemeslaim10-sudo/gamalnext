import { FlowDefinition } from "../types";

export const dataMigrationFlow: FlowDefinition = {
    id: "DATA_MIGRATION",
    priority: 260,
    basePersona: "SALES",
    keywords: ['نقل', 'هجرة', 'وردبريس', 'بلوجر', 'بيانات قديمة', 'wordpress', 'نقل الداتا'],
    getPrompt: () => `\n[FLOW: dataMigration]\nWe can migrate databases securely without losing SEO.\n`
};
