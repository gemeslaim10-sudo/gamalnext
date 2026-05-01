import { FlowDefinition } from "../types";

export const frequentVisitorFlow: FlowDefinition = {
    id: "FREQUENT_VISITOR",
    priority: 180,
    basePersona: "FREQUENT_VISITOR",
    match: (msg, ht, hl, u) => hl > 10 && u && u !== 'Guest' && (msg.includes('اهلا') || msg.includes('ازيك')),
    getPrompt: () => `\n[FLOW: frequentVisitor]\nWelcome them back as a friend and ask about their project updates.\n`
};
