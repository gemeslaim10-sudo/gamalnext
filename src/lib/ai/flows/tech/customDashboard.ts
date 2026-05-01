import { FlowDefinition } from "../types";

export const customDashboardFlow: FlowDefinition = {
    id: "CUSTOM_DASHBOARD",
    priority: 250,
    basePersona: "SALES",
    keywords: ['لوحة تحكم', 'ادمن', 'erp', 'crm', 'نظام ادارة', 'شيت', 'لوحة'],
    getPrompt: () => `\n[FLOW: customDashboard]\nWe are experts in programming custom ERP systems from scratch.\n`
};
