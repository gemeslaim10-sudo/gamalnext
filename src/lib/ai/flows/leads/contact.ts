import { FlowDefinition } from "../types";

export const contactFlow: FlowDefinition = {
    id: "CONTACT",
    priority: 360,
    basePersona: "SALES",
    keywords: ['رقم', 'تواصل', 'تليفون', 'اتصل', 'اكلمك'],
    getPrompt: () => `\n[FLOW: contact]\nGive them the contact info and take their message.\n`
};
