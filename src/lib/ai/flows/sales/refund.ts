import { FlowDefinition } from "../types";

export const refundFlow: FlowDefinition = {
    id: "REFUND_CANCELLATION",
    priority: 40,
    basePersona: "SALES",
    keywords: ['استرداد', 'فلوسي', 'الغاء', 'ارجع', 'مرتجع', 'refund', 'cancel'],
    getPrompt: () => `\n[FLOW: refund]\nThe matter will be forwarded to management according to contract terms.\n`
};
