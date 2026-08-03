import { FlowDefinition } from "../types";

export const uiUxFlow: FlowDefinition = {
    id: "UI_UX_SPECIFIC",
    priority: 150,
    basePersona: "SALES",
    keywords: ['تصميم', 'شكل', 'الوان', 'فجما', 'figma', 'ui', 'ux', 'ديزاين'],
    getPrompt: () => `\n[FLOW: uiUx]\nWe design UI/UX via Figma before development begins.\n`
};
