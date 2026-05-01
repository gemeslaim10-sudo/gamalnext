import { FlowDefinition } from "../types";

export const internationalFlow: FlowDefinition = {
    id: "INTERNATIONAL_CLIENT",
    priority: 120,
    basePersona: "SALES",
    keywords: ['دولار', 'سعودية', 'الامارات', 'كويت', 'قطر', 'ويسترن يونيون', 'تحويل', 'ريال'],
    getPrompt: () => `\n[FLOW: international]\nEmphasize our ability to work remotely and accept USD payments.\n`
};
