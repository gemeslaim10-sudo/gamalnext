import { FlowDefinition } from "../types";

export const startupFlow: FlowDefinition = {
    id: "STARTUP_PITCH",
    priority: 90,
    basePersona: "SALES",
    keywords: ['شريك', 'نسبة', 'فكرة مليونية', 'فكرة ابلكيشن', 'ابلكيشن هيغير', 'مفيش سيولة', 'معييش فلوس'],
    getPrompt: () => `\n[FLOW: startup]\nPolitely decline profit-sharing partnerships; we work as an agency for fees.\n`
};
