import { FlowDefinition } from "../types";

export const legalFlow: FlowDefinition = {
    id: "COMPLIANCE_LEGAL",
    priority: 220,
    basePersona: "SALES",
    keywords: ['عقد', 'فاتورة', 'ضرائب', 'ضريبة', 'قانوني', 'nda', 'ضمانات'],
    getPrompt: () => `\n[FLOW: legal]\nWe work with official contracts and issue invoices.\n`
};
