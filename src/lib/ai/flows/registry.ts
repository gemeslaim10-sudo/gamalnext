import { FlowDefinition } from "./types";
import { personasFlows } from "./personas";
import { salesFlows } from "./sales";
import { techFlows } from "./tech";
import { servicesFlows } from "./services";
import { leadsFlows } from "./leads";
import type { ChatMessage } from "../utils/failoverManager";

// Aggregate all flows and sort by priority (lowest number = checked first)
export const allFlows: FlowDefinition[] = [
    ...personasFlows,
    ...salesFlows,
    ...techFlows,
    ...servicesFlows,
    ...leadsFlows
].sort((a, b) => a.priority - b.priority);

export const SUPPORT_FLOW: FlowDefinition = {
    id: 'SUPPORT',
    priority: 9999,
    basePersona: 'SALES',
    getPrompt: () => `
[FLOW: SUPPORT]
Mission:
1. Answer the user briefly, directly, and helpfully.
2. Smartly redirect the conversation to market Gamal's services (websites, e-commerce, WhatsApp automation).
`
};

export function determineFlow(message: string, history: ChatMessage[], userName?: string): FlowDefinition {
    const q = message.toLowerCase();
    const historyText = history.map(h => h.parts?.[0]?.text?.toLowerCase() || "").join(' ');
    const historyLength = history.length;
    const actualName = (userName && userName.toLowerCase() !== 'guest' && userName !== 'زائر') ? userName : undefined;

    for (const flow of allFlows) {
        // 1. Check advanced match function if it exists
        if (flow.match) {
            let matched = false;
            // If it also has keywords, we check if keywords match OR advanced match
            if (flow.keywords && flow.keywords.length > 0) {
                if (flow.keywords.some(k => q.includes(k))) {
                    matched = flow.match(q, historyText, historyLength, actualName);
                }
            } else {
                matched = flow.match(q, historyText, historyLength, actualName);
            }

            if (matched) return flow;
            continue;
        }

        // 2. Fallback to simple keyword checking
        if (flow.keywords && flow.keywords.length > 0) {
            if (flow.keywords.some(k => q.includes(k))) {
                return flow;
            }
        }
    }

    // Default Fallback
    return SUPPORT_FLOW;
}
