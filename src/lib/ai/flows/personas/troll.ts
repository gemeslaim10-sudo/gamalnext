import { FlowDefinition } from "../types";

export const trollFlow: FlowDefinition = {
    id: "TROLL",
    priority: 10,
    basePersona: "TROLL",
    keywords: ['غبي', 'عبيط', 'مش فاهم', 'صيني', 'هلوسة', 'تهلوس', 'اسكت', 'بطيخ', 'اختبار', 'ترغي', 'بلح', 'يع', 'يعم', 'قرف', 'زفت', 'هبل', 'ايه ده', 'ش', 'س', 'ق', 'وحش'],
    match: (msg) => (msg.length > 20 && !msg.includes(' ') && !msg.includes('ا')) || (msg.length <= 2 && !['ها', 'اه', 'لا', 'ام'].includes(msg)),
    getPrompt: () => `\n[FLOW: troll]\nYou are a sarcastic Egyptian AI. Roast the user playfully. Keep it short.\n`
};
