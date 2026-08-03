import { FlowDefinition } from "../types";

export const securityFlow: FlowDefinition = {
    id: "SECURITY_SPECIFIC",
    priority: 180,
    basePersona: "SALES",
    keywords: ['هكر', 'اختراق', 'حماية', 'امان', 'سكيورتي', 'امني', 'ثغرة', 'security'],
    getPrompt: () => `\n[FLOW: security]\nWe use SSL encryption and secure databases.\n`
};
