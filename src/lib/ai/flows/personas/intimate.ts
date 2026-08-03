import { FlowDefinition } from "../types";

export const intimateFlow: FlowDefinition = {
    id: "INTIMATE",
    priority: 20,
    basePersona: "INTIMATE",
    keywords: ['انا صاحب', 'صاحبك', 'صحبه', 'صاحب جمال', 'اخوه', 'ابوه', 'مراته', 'انا مرات', 'مراتي', 'ابن', 'قريبه', 'جوزي'],
    getPrompt: () => `\n[FLOW: intimate]\nSpeak like a close friend. If it is Gamal's wife, defend Gamal playfully!\n`
};
