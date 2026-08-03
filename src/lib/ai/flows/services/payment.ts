import { FlowDefinition } from "../types";

export const paymentFlow: FlowDefinition = {
    id: "PAYMENT_GATEWAY",
    priority: 270,
    basePersona: "SALES",
    keywords: ['دفع', 'فيزا', 'فوري', 'بيموب', 'بايبال', 'شريط', 'stripe', 'paymob', 'تقسيط', 'فاليو', 'valu'],
    getPrompt: () => `\n[FLOW: payment]\nWe integrate payment gateways like Paymob, Stripe, and PayPal.\n`
};
