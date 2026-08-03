import { FlowDefinition } from "../types";

export const greetingFlow: FlowDefinition = {
    id: "GREETING",
    priority: 190,
    basePersona: "GREETING",
    match: (_msg, _ht, hl) => hl <= 2,
    getPrompt: () => `\n[FLOW: greeting]\nGreet the user warmly and ask how you can help.\n`
};
