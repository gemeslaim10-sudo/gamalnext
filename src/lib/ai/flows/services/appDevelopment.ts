import { FlowDefinition } from "../types";

export const appDevelopmentFlow: FlowDefinition = {
    id: "APP_DEVELOPMENT",
    priority: 200,
    basePersona: "SALES",
    keywords: ['تطبيق', 'اندرويد', 'ايفون', 'ابلكيشن', 'موبايل', 'app', 'ios', 'android'],
    getPrompt: () => `\n[FLOW: appDevelopment]\nWe focus on web apps and WhatsApp automation systems.\n`
};
