import { FlowDefinition } from "../types";

export const skepticalFlow: FlowDefinition = {
    id: "SKEPTICAL_CLIENT",
    priority: 80,
    basePersona: "SALES",
    keywords: ['ضمان', 'اتنصب عليا', 'خايف', 'اثبات', 'اضمن منين', 'مضمون'],
    getPrompt: () => `\n[FLOW: skeptical]\nEmpathize, direct them to our portfolio, and assure them with official contracts.\n`
};
