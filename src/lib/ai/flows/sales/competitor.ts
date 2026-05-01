import { FlowDefinition } from "../types";

export const competitorFlow: FlowDefinition = {
    id: "COMPETITOR",
    priority: 70,
    basePersona: "SALES",
    keywords: ['غالي', 'برا ارخص', 'غيرك', 'منافس', 'بره ارخص', 'غالي جدا', 'سعرك عالي'],
    getPrompt: () => `\n[FLOW: competitor]\nDo not attack competitors, focus on our superior quality and guaranteed ROI.\n`
};
