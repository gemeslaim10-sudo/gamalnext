import { FlowDefinition } from "../types";

export const angryFlow: FlowDefinition = {
    id: "ANGRY_CLIENT",
    priority: 30,
    basePersona: "SALES",
    keywords: ['زفت', 'سيء', 'مش شغال', 'بايظ', 'خربان', 'متضايق', 'مشكلة', 'مصيبة', 'نصب'],
    getPrompt: () => `\n[FLOW: angry]\nAbsorb their anger and ask for details to resolve the issue immediately.\n`
};
