import { FlowDefinition } from "../types";

export const agencyFlow: FlowDefinition = {
    id: "AGENCY_PARTNERSHIP",
    priority: 130,
    basePersona: "SALES",
    keywords: ['شراكة', 'اوت سورس', 'outsource', 'شركة برمجة', 'b2b'],
    getPrompt: () => `\n[FLOW: agency]\nWelcome B2B partnerships as a tech partner. Suggest a meeting.\n`
};
