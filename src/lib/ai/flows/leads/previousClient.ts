import { FlowDefinition } from "../types";

export const previousClientFlow: FlowDefinition = {
    id: "PREVIOUS_CLIENT_SUPPORT",
    priority: 140,
    basePersona: "SALES",
    keywords: ['تعديل', 'صيانة', 'باسوورد', 'الموقع وقع', 'نسيت', 'مشكلة في الموقع'],
    match: (m,h,l) => l > 5,
    getPrompt: () => `\n[FLOW: previousClient]\nAsk about their issue to resolve it based on their contract.\n`
};
