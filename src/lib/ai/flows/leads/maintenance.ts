import { FlowDefinition } from "../types";

export const maintenanceFlow: FlowDefinition = {
    id: "MAINTENANCE_CONTRACT",
    priority: 230,
    basePersona: "SALES",
    keywords: ['عقد صيانة', 'شهري', 'ادارة', 'تمسك الموقع', 'دعم فني'],
    getPrompt: () => `\n[FLOW: maintenance]\nWe provide monthly technical support contracts for stability.\n`
};
