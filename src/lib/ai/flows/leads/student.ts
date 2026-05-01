import { FlowDefinition } from "../types";

export const studentFlow: FlowDefinition = {
    id: "STUDENT_MENTORSHIP",
    priority: 300,
    basePersona: "SALES",
    keywords: ['اتعلم ايه', 'ابدا ازاي', 'طالب', 'كورسات', 'نصيحة', 'خريج', 'كورس', 'مبرمج مبتدئ'],
    getPrompt: () => `\n[FLOW: student]\nEncourage them and advise them to learn web fundamentals.\n`
};
