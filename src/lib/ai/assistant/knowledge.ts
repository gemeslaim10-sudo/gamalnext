// Picks which knowledge cards go into the prompt for one message.
//
// Small knowledge base  → every active card is sent (the model sees everything).
// Large knowledge base  → pinned cards are always sent, then the cards that share the most
//                         keywords with the recent conversation, until the size budget is used.
// Matching works across Arabic and English: text is normalized (hamza/ta marbuta/diacritics),
// lightly stemmed, and common business words are mapped to shared keys (سعر ↔ price…).

import { cardChars, type KnowledgeCard, type KnowledgeUsage } from "./shared";

export interface KnowledgeSelection {
    cards: KnowledgeCard[];
    usage: KnowledgeUsage;
}

interface SelectOptions {
    /** Send everything while all active cards fit in this many characters */
    allCardsMaxChars: number;
    /** Budget for pinned + relevant cards when the base is larger */
    budgetChars: number;
    /** Hard cap on relevant (non-pinned) cards */
    maxRelevant?: number;
}

export function selectKnowledge(allCards: KnowledgeCard[], query: string, options: SelectOptions): KnowledgeSelection {
    const active = allCards.filter((c) => c.active && (c.title || c.content));
    const activeChars = active.reduce((sum, c) => sum + cardChars(c), 0);
    const describe = (c: KnowledgeCard, score?: number) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        pinned: c.pinned,
        ...(score !== undefined ? { score: Math.round(score * 10) / 10 } : {}),
    });

    // Pinned first, then the owner's own order
    const ordered = [...active.filter((c) => c.pinned), ...active.filter((c) => !c.pinned)];

    if (activeChars <= options.allCardsMaxChars) {
        return {
            cards: ordered,
            usage: { mode: "all", used: ordered.map((c) => describe(c)), activeCount: active.length, activeChars, usedChars: activeChars },
        };
    }

    const queryWeights = weightQuery(query);
    const selected: KnowledgeCard[] = [];
    const used: KnowledgeUsage["used"] = [];
    let usedChars = 0;

    for (const card of active.filter((c) => c.pinned)) {
        selected.push(card);
        used.push(describe(card));
        usedChars += cardChars(card);
    }

    const scored = active
        .filter((c) => !c.pinned)
        .map((card) => ({ card, score: scoreCard(card, queryWeights) }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);

    const maxRelevant = options.maxRelevant ?? 12;
    let added = 0;
    for (const { card, score } of scored) {
        if (added >= maxRelevant) break;
        const size = cardChars(card);
        if (usedChars + size > options.budgetChars) continue; // a smaller card may still fit
        selected.push(card);
        used.push(describe(card, score));
        usedChars += size;
        added++;
    }

    return { cards: selected, usage: { mode: "relevant", used, activeCount: active.length, activeChars, usedChars } };
}

// ── Scoring ───────────────────────────────────────────────────────────────────

const FIELD_WEIGHTS = { title: 3, tags: 3, category: 1.5, content: 1 } as const;

function scoreCard(card: KnowledgeCard, query: Map<string, number>): number {
    if (query.size === 0) return 0;
    const fields: [Set<string>, number][] = [
        [tokenSet(card.title), FIELD_WEIGHTS.title],
        [tokenSet(card.tags.join(" ")), FIELD_WEIGHTS.tags],
        [tokenSet(card.category), FIELD_WEIGHTS.category],
        [tokenSet(card.content), FIELD_WEIGHTS.content],
    ];
    let score = 0;
    for (const [token, weight] of query) {
        let best = 0;
        for (const [set, fieldWeight] of fields) {
            if (fieldWeight > best && hasToken(set, token)) best = fieldWeight;
        }
        score += best * weight;
    }
    return score;
}

/** Exact match, or a shared prefix for longer words (plural/affix differences). */
function hasToken(set: Set<string>, token: string): boolean {
    if (set.has(token)) return true;
    if (token.length < 4) return false;
    for (const t of set) {
        if (t.length >= 4 && (t.startsWith(token) || token.startsWith(t))) return true;
    }
    return false;
}

/** The latest message counts double; earlier turns add context. */
function weightQuery(query: string): Map<string, number> {
    const [latest = "", ...rest] = query.split("\n---\n");
    const weights = new Map<string, number>();
    for (const t of tokenSet(rest.join(" "))) weights.set(t, 1);
    for (const t of tokenSet(latest)) weights.set(t, 2);
    return weights;
}

/** Builds the retrieval query: latest message first, then the last few turns. */
export function buildRetrievalQuery(message: string, recentTexts: string[]): string {
    return [message, recentTexts.slice(-4).join(" ")].join("\n---\n");
}

// ── Text normalization ────────────────────────────────────────────────────────

const ARABIC_DIACRITICS = /[ً-ٰٟۖ-ۭـ]/g;

function normalize(text: string): string {
    return text
        .toLowerCase()
        .replace(ARABIC_DIACRITICS, "")
        .replace(/[إأآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

const ARABIC_CHAR = /[؀-ۿ]/;

function stem(token: string): string {
    if (ARABIC_CHAR.test(token)) {
        let t = token;
        for (const prefix of ["وال", "بال", "كال", "فال", "لل", "ال"]) {
            if (t.startsWith(prefix) && t.length - prefix.length >= 3) {
                t = t.slice(prefix.length);
                break;
            }
        }
        for (const suffix of ["ات", "ين", "ون", "ها", "هم", "كم"]) {
            if (t.endsWith(suffix) && t.length - suffix.length >= 3) {
                t = t.slice(0, -suffix.length);
                break;
            }
        }
        return t;
    }
    if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
    if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
    if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
    return token;
}

const STOPWORDS = new Set(
    (
        "the a an and or of to in on for with is are was be it this that you your we our i me my do does can could " +
        "would should what how which who when where why about from at by as if not no yes please hi hello thanks " +
        "want need have has get tell know " +
        "في من على الى عن مع هل ما ماذا لو او و يا انا انت انتم احنا ده دي دا ايه عايز عاوز محتاج ممكن " +
        "كده بس لي ليا عند عندي عندك هو هي هم اللي الي كل اي شو كيف لماذا فين امتى"
    )
        .split(/\s+/)
        .map((w) => stem(normalize(w)))
);

/** Common business words in both languages → one shared key, so Arabic questions find English cards. */
const SYNONYM_GROUPS: Record<string, string[]> = {
    price: ["سعر", "اسعار", "بكام", "تكلفه", "تكلف", "ميزانيه", "كام", "cost", "pricing", "quote", "budget", "package", "باقه", "باقات"],
    website: ["موقع", "مواقع", "ويب", "site", "web", "landing", "صفحه"],
    store: ["متجر", "متاجر", "ستور", "ecommerce", "shop", "commerce"],
    shopify: ["شوبيفاي", "شوبفاي", "شوبيفى"],
    theme: ["ثيم", "ثيمات", "قالب", "قوالب", "template"],
    wordpress: ["ووردبريس", "وردبريس", "ووردبرس", "woocommerce", "ووكومرس"],
    hosting: ["استضافه", "هوستنج", "هوست", "سيرفر", "server", "domain", "دومين"],
    erp: ["موارد", "مخازن", "مخزن", "محاسبه", "حسابات", "inventory", "accounting"],
    crm: ["عملاء", "مبيعات", "customer", "sales", "pipeline"],
    whatsapp: ["واتساب", "واتس", "whats"],
    chatbot: ["بوت", "شات", "chat", "bot", "ذكاء", "ai", "اصطناعي"],
    automation: ["اتمته", "automate", "automatic", "تلقائي"],
    maintenance: ["صيانه", "دعم", "support"],
    identity: ["هويه", "براند", "brand", "لوجو", "logo", "branding"],
    design: ["تصميم", "ديزاين"],
    analysis: ["تحليل", "دراسه", "analyze", "analyst"],
    start: ["ابدا", "خطوات", "ازاي", "process", "steps", "begin", "اتعامل"],
    contact: ["تواصل", "رقم", "اتصال", "call", "phone", "واتسابك"],
    custom: ["مخصص", "مخصوص", "خاص", "نظام", "برنامج", "system", "software"],
    project: ["مشروع", "مشاريع", "اعمال", "portfolio", "work", "سابقه"],
};

const SYNONYM_LOOKUP: Map<string, string> = (() => {
    const map = new Map<string, string>();
    for (const [key, words] of Object.entries(SYNONYM_GROUPS)) {
        const canonical = stem(normalize(key));
        map.set(canonical, canonical);
        for (const w of words) map.set(stem(normalize(w)), canonical);
    }
    return map;
})();

function tokenSet(text: string): Set<string> {
    const set = new Set<string>();
    for (const raw of normalize(text).split(/[^a-z0-9؀-ۿ]+/)) {
        if (raw.length < 2) continue;
        const token = stem(raw);
        if (token.length < 2 || STOPWORDS.has(token)) continue;
        set.add(token);
        const canonical = SYNONYM_LOOKUP.get(token);
        if (canonical) set.add(canonical);
    }
    return set;
}
