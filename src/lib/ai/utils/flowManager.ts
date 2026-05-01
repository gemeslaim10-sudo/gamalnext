import type { ChatMessage } from "./failoverManager";
import { determineFlowState } from "../flows/router";
import { determineFlow } from "../flows/registry";

/**
 * Returns the flow instruction string for the given message + history context.
 * Delegates to registry.ts (FlowDefinition-based system) which aggregates all flows.
 */
export function getFlowInstruction(
    message: string,
    history: ChatMessage[],
    userName?: string,
    precomputedState?: import("../flows/router").FlowState
): string {
    // If a pre-computed state is provided, resolve it to a flow via the router-aware registry.
    // Otherwise, let registry.ts determine the best matching flow via its keyword/match system.
    if (precomputedState) {
        // Map FlowState → FlowDefinition using the router state to find the right flow.
        const stateMessage = _mapStateToKeyword(precomputedState);
        const flow = determineFlow(stateMessage, history, userName);
        return flow.getPrompt(userName);
    }

    const flow = determineFlow(message, history, userName);
    return flow.getPrompt(userName);
}

/**
 * Returns the detected FlowState string for a given message (useful for logging/UI).
 */
export function detectFlowState(
    message: string,
    history: ChatMessage[],
    userName?: string
): string {
    return determineFlowState(message, history, userName);
}

/**
 * Maps a FlowState enum value to a representative keyword that will trigger
 * the correct FlowDefinition in the registry. Used only when a precomputedState
 * is passed directly (e.g. from a cached route decision).
 */
function _mapStateToKeyword(state: import("../flows/router").FlowState): string {
    const stateKeywordMap: Record<import("../flows/router").FlowState, string> = {
        GREETING: "اهلا",
        PORTFOLIO: "اعمال",
        CONTACT: "تواصل",
        CONSULTATION: "استشارة",
        TROLL: "غبي",
        JOKER: "نكتة",
        FREQUENT_VISITOR: "ازيك اهلا",
        SUPPORT: "",
        INTIMATE: "صاحبك",
        PRICING: "بكام",
        COMPETITOR: "غالي",
        TECHNICAL_GEEK: "react",
        URGENT: "بسرعة",
        ANGRY_CLIENT: "مش شغال",
        HIRING_SEEKER: "شغل عايز",
        STUDENT_MENTORSHIP: "اتعلم ايه",
        SCAMMER: "تسويق خدمات شركة",
        WHATSAPP_AUTOMATION: "واتساب",
        ECOMMERCE: "متجر",
        REFUND_CANCELLATION: "استرداد",
        INTERNATIONAL_CLIENT: "دولار",
        DISCOUNT_SEEKER: "خصم",
        AGENCY_PARTNERSHIP: "شراكة",
        PREVIOUS_CLIENT_SUPPORT: "تعديل",
        UI_UX_SPECIFIC: "تصميم",
        SEO_SPECIFIC: "seo",
        PERFORMANCE_SPECIFIC: "سرعة",
        SECURITY_SPECIFIC: "هكر",
        HOSTING_DOMAIN: "استضافة",
        APP_DEVELOPMENT: "تطبيق",
        AI_INTEGRATION: "ذكاء اصطناعي",
        COMPLIANCE_LEGAL: "عقد",
        MAINTENANCE_CONTRACT: "عقد صيانة",
        LANGUAGE_SUPPORT: "لغتين",
        CUSTOM_DASHBOARD: "لوحة تحكم",
        DATA_MIGRATION: "نقل",
        PAYMENT_GATEWAY: "دفع",
        ANALYTICS_TRACKING: "بيكسل",
        STARTUP_PITCH: "شريك",
        SKEPTICAL_CLIENT: "ضمان",
    };
    return stateKeywordMap[state] ?? "";
}
