// Shared by the assistant runtime (server), the chat widget and the admin pages.
// Keep this file free of server-only imports (firebase-admin, secrets).

// ── Firestore locations ───────────────────────────────────────────────────────

/** Owner-editable assistant settings + API keys (admin-only in firestore.rules). */
export const AI_SETTINGS_DOC = { collection: "settings", id: "ai" } as const;
/** Knowledge cards: `{ cards: KnowledgeCard[], updatedAt }` (admin-only, read by the server with the Admin SDK). */
export const AI_KNOWLEDGE_DOC = { collection: "settings", id: "ai_knowledge" } as const;

// ── Knowledge base ────────────────────────────────────────────────────────────

export interface KnowledgeCard {
    id: string;
    title: string;
    category: string;
    content: string;
    /** Extra words visitors might use (any language) — they help retrieval */
    tags: string[];
    /** Inactive cards are kept but never sent to the assistant */
    active: boolean;
    /** Pinned cards are always sent, even when the knowledge base is large */
    pinned: boolean;
    createdAt?: number;
    updatedAt?: number;
}

export const KNOWLEDGE_LIMITS = {
    /**
     * While all active cards fit in this many characters, every card is sent with each message.
     * Kept small on purpose: every message pays for the whole prompt, so a bigger knowledge base
     * sends the pinned cards plus the ones that match the conversation.
     */
    allCardsMaxChars: 4_000,
    /** Above that: pinned cards + the most relevant cards, up to this many characters */
    relevantMaxChars: 3_500,
    /** Smaller budget used for the backup models, whose free tiers allow only a few thousand tokens a minute */
    compactMaxChars: 3_500,
    /** Firestore documents max out at 1 MiB; warn well before that */
    docWarnChars: 700_000,
    titleMax: 120,
    categoryMax: 60,
    contentMax: 8_000,
    tagsMax: 20,
} as const;

/** Characters a card adds to the prompt (title + category + tags + content). */
export function cardChars(card: Pick<KnowledgeCard, "title" | "category" | "content" | "tags">): number {
    return card.title.length + card.category.length + card.content.length + card.tags.join(", ").length + 8;
}

/** Turns anything read from Firestore into clean cards (drops broken entries, fills defaults). */
export function sanitizeCards(raw: unknown): KnowledgeCard[] {
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    const cards: KnowledgeCard[] = [];
    for (const item of raw) {
        if (!item || typeof item !== "object") continue;
        const c = item as Record<string, unknown>;
        const title = str(c.title).trim().slice(0, KNOWLEDGE_LIMITS.titleMax);
        const content = str(c.content).trim().slice(0, KNOWLEDGE_LIMITS.contentMax);
        if (!title && !content) continue;
        let id = str(c.id).trim() || newCardId();
        if (seen.has(id)) id = newCardId();
        seen.add(id);
        cards.push({
            id,
            title,
            category: str(c.category).trim().slice(0, KNOWLEDGE_LIMITS.categoryMax),
            content,
            tags: parseTags(c.tags),
            active: c.active !== false,
            pinned: c.pinned === true,
            createdAt: typeof c.createdAt === "number" ? c.createdAt : undefined,
            updatedAt: typeof c.updatedAt === "number" ? c.updatedAt : undefined,
        });
    }
    return cards;
}

/** Accepts an array or a comma/newline separated string. */
export function parseTags(raw: unknown): string[] {
    const list = Array.isArray(raw) ? raw.map(str) : str(raw).split(/[,،\n]/);
    const tags = list.map((t) => t.trim()).filter(Boolean);
    return [...new Set(tags)].slice(0, KNOWLEDGE_LIMITS.tagsMax);
}

export function newCardId(): string {
    const random = Math.random().toString(36).slice(2, 8);
    return `card_${Date.now().toString(36)}${random}`;
}

// ── Assistant profile (everything on /admin/ai except the keys) ───────────────

export interface AssistantProfile {
    /** Company name the assistant represents */
    brandName: string;
    /** Shown in the chat header */
    assistantName: string;
    /** Small line under the name in the chat header */
    assistantSubtitle: string;
    /** Placeholder of the message box */
    inputPlaceholder: string;
    /** First bubble of every chat. `{name}` becomes the visitor's name when known */
    welcomeMessage: string;
    /** Who the assistant is and how it presents itself */
    persona: string;
    /** What the assistant should achieve in conversations */
    goals: string;
    /** Voice, dialect, length, emoji… */
    tone: string;
    /** One rule per line */
    rules: string;
    /** What to do when it doesn't know the answer */
    unsureBehavior: string;
    /** How and when to ask for contact details */
    leadGuidance: string;
    /** "auto" = the visitor's language (Egyptian Arabic for Arabic), or always Arabic / always English */
    replyLanguage: ReplyLanguage;
    /** Main Gemini model id */
    modelName: string;
}

export type ReplyLanguage = "auto" | "ar" | "en";

export const REPLY_LANGUAGE_OPTIONS: { id: ReplyLanguage; label: string }[] = [
    { id: "auto", label: "نفس لغة الزائر (عامية مصرية لو كتب بالعربي)" },
    { id: "ar", label: "عامية مصرية دائمًا" },
    { id: "en", label: "English دائمًا" },
];

export const PROFILE_FIELDS = [
    "brandName",
    "assistantName",
    "assistantSubtitle",
    "inputPlaceholder",
    "welcomeMessage",
    "persona",
    "goals",
    "tone",
    "rules",
    "unsureBehavior",
    "leadGuidance",
    "replyLanguage",
    "modelName",
] as const satisfies readonly (keyof AssistantProfile)[];

export const DEFAULT_MODEL = "gemini-flash-latest";

/** Gemini models offered in the dashboard. Any other Gemini model id can be typed in by hand. */
export const GEMINI_MODEL_OPTIONS: { id: string; label: string }[] = [
    { id: "gemini-flash-latest", label: "Gemini Flash (latest) — recommended" },
    { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash" },
    { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { id: "gemini-flash-lite-latest", label: "Gemini Flash Lite (latest) — fastest, lighter" },
    { id: "gemini-pro-latest", label: "Gemini Pro (latest) — most thorough, needs a paid plan" },
];

/**
 * Tried in this order after the model chosen in the dashboard. Each Gemini model has its own
 * free-tier quota, so a busy or exhausted model doesn't take the assistant down.
 */
export const GEMINI_FALLBACK_MODELS = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-lite-latest"];

/**
 * Safety-net defaults, used only when a field has never been saved (or the database can't be read).
 * The real values live in `settings/ai` and are edited on /admin/ai.
 */
export const DEFAULT_PROFILE: AssistantProfile = {
    brandName: "GTech",
    assistantName: "GTech Assistant",
    assistantSubtitle: "Ask about services, projects or getting started",
    inputPlaceholder: "Type your message…",
    welcomeMessage: "Hi {name}! I'm the GTech assistant. How can I help you today?",
    persona:
        "You are the assistant of GTech, the company of Gamal Abdelaty. You know GTech's services well and speak like a helpful, experienced member of the team.",
    goals:
        "Help visitors understand what GTech offers and which service fits their needs, answer their questions clearly, and when someone has a real project, collect their name and phone number so Gamal can follow up.",
    tone: "Friendly, professional and concise. Plain language, no hype.",
    rules: "",
    unsureBehavior:
        "Say honestly that you don't have that detail and offer to have Gamal follow up personally (ask for their name and phone number, or share the WhatsApp link). Never guess.",
    leadGuidance:
        "When a visitor wants a quote, wants to start a project or asks to be contacted, ask for their name and phone (WhatsApp) number — naturally, one thing at a time, without pressure. Never ask for an email address.",
    replyLanguage: "auto",
    modelName: DEFAULT_MODEL,
};

/**
 * Reads `settings/ai` into a full profile. Older installs stored the instructions in
 * `systemRole` (persona), `prompt` (rules) and `stylePrompt` (tone); those are used until
 * the new fields are saved, so nothing the owner wrote is lost.
 */
export function resolveProfile(data: Record<string, unknown> | undefined | null): AssistantProfile {
    const d = data || {};
    const has = (key: string) => typeof d[key] === "string";
    const text = (key: string) => normalizeStoredText(str(d[key]));

    const legacyRole = text("systemRole").trim();
    const legacyPrompt = text("prompt").trim();
    const legacyStyle = text("stylePrompt").trim();

    const pick = (key: keyof AssistantProfile, legacy?: string) => {
        if (has(key)) return text(key);
        if (legacy) return legacy;
        return DEFAULT_PROFILE[key];
    };

    const model = str(d.modelName).trim().replace(/^models\//, "");
    const language = str(d.replyLanguage);

    return {
        brandName: pick("brandName").trim() || DEFAULT_PROFILE.brandName,
        assistantName: pick("assistantName").trim(),
        assistantSubtitle: pick("assistantSubtitle").trim(),
        inputPlaceholder: pick("inputPlaceholder").trim(),
        welcomeMessage: pick("welcomeMessage").trim(),
        persona: pick("persona", legacyRole || legacyPrompt),
        goals: pick("goals"),
        tone: pick("tone", legacyStyle),
        rules: pick("rules", legacyRole && legacyPrompt ? legacyPrompt : undefined),
        unsureBehavior: pick("unsureBehavior"),
        leadGuidance: pick("leadGuidance"),
        replyLanguage: language === "ar" || language === "en" ? language : "auto",
        modelName: !model || model === "auto" || model === "تلقائي" ? DEFAULT_MODEL : model,
    };
}

// ── Public widget config (GET /api/chat) ──────────────────────────────────────

export interface PublicChatConfig {
    assistantName: string;
    subtitle: string;
    placeholder: string;
    /** May contain `{name}`; fill it with `fillWelcome()` */
    welcomeMessage: string;
}

export function toPublicConfig(profile: AssistantProfile): PublicChatConfig {
    return {
        // A blank name or placeholder is never intended, so those fall back; subtitle and welcome may be blank on purpose
        assistantName: profile.assistantName || `${profile.brandName} Assistant`,
        subtitle: profile.assistantSubtitle,
        placeholder: profile.inputPlaceholder || DEFAULT_PROFILE.inputPlaceholder,
        welcomeMessage: profile.welcomeMessage,
    };
}

/** Replaces `{name}` with the visitor's name, or removes it cleanly for guests. */
export function fillWelcome(template: string, name?: string | null): string {
    const clean = (name || "").trim();
    if (clean) return template.replace(/\{name\}/g, clean).trim();
    return template
        .replace(/[ \t]*\{name\}/g, "")
        .replace(/[ \t]+([,،!؟?.])/g, "$1")
        .trim();
}

/** Names that mean "we don't know who this is". */
export function isRealName(name: string | null | undefined): name is string {
    const n = (name || "").trim().toLowerCase();
    return (
        n.length >= 2 &&
        !["guest", "user", "anonymous", "visitor", "unknown", "n/a", "none", "customer", "client", "زائر", "ضيف", "عميل", "العميل", "مجهول", "غير معروف"].includes(n)
    );
}

// ── Debug info returned in test mode ──────────────────────────────────────────

export interface KnowledgeUsage {
    mode: "all" | "relevant";
    used: { id: string; title: string; category: string; pinned: boolean; score?: number }[];
    activeCount: number;
    activeChars: number;
    usedChars: number;
}

export interface LeadAttempt {
    name: string;
    phone: string;
    service?: string;
    message?: string;
    /** True only when it was written to the `leads` collection (never in test mode) */
    saved: boolean;
    errors?: Record<string, string>;
    via: "tool" | "tag";
}

export interface AssistantDebug {
    provider: string;
    model: string;
    attempts: { provider: string; model: string; error: string; ms: number }[];
    knowledge: KnowledgeUsage;
    promptChars: number;
    systemPrompt: string;
    toolCalls: number;
    lead: LeadAttempt | null;
    ms: number;
    settingsFromDatabase: boolean;
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function str(v: unknown): string {
    return typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
}

/** Some old values were saved with a literal "\n" instead of a line break. */
export function normalizeStoredText(value: string): string {
    return value.replace(/\\r\\n|\\n/g, "\n");
}
