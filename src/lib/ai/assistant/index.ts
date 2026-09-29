// Server only: the site assistant. One entry point used by /api/chat.
//
//   settings/ai + settings/ai_knowledge + live site data ──► one system prompt
//   Gemini (dashboard model → fallbacks) ──► Groq / OpenRouter / OpenAI backups
//   save_lead tool (or <lead> tag on backups) ──► saveLead()
import { buildRetrievalQuery, selectKnowledge, type KnowledgeSelection } from "./knowledge";
import { cleanReply, createLeadRecorder, parseLeadTag, SAVE_LEAD_TOOL } from "./leads";
import { buildSystemPrompt, type PromptInput, type VisitorInfo } from "./prompt";
import { MESSAGE_MAX_CHARS, normalizeHistory, withPendingMessage } from "./history";
import { ProviderError, runCompatible, runGemini, type CompatibleEndpoint, type ProviderResult } from "./providers";
import { loadKnowledge, loadSettings, type ProviderKeys } from "./settings";
import { loadSiteFacts } from "./siteFacts";
import { fillWelcome, GEMINI_FALLBACK_MODELS, KNOWLEDGE_LIMITS, type AssistantDebug, type LeadAttempt } from "./shared";

export { MESSAGE_MAX_CHARS } from "./history";
export type { VisitorInfo } from "./prompt";

export interface AssistantInput {
    message: string;
    /** Earlier turns as sent by the widget */
    history: unknown;
    visitor: VisitorInfo;
    sessionId?: string | null;
    userId?: string | null;
    userEmail?: string | null;
    /** Admin test mode: fresh settings, no lead is stored */
    test?: boolean;
    /** Test mode only: try this Gemini model first instead of the saved one */
    model?: string;
}

export interface AssistantOutput {
    reply: string;
    provider: string;
    model: string;
    lead: LeadAttempt | null;
    debug: AssistantDebug;
}

type Attempt = AssistantDebug["attempts"][number];

export class AssistantUnavailableError extends Error {
    constructor(readonly attempts: Attempt[]) {
        super("Every AI provider failed");
        this.name = "AssistantUnavailableError";
    }
}

/** Stop trying new models after this long, so the request finishes within the function limit. */
const DEADLINE_MS = 50_000;
const GEMINI_TIMEOUT_MS = 25_000;
const BACKUP_TIMEOUT_MS = 20_000;

export async function runAssistant(input: AssistantInput): Promise<AssistantOutput> {
    const started = Date.now();
    const fresh = !!input.test;
    const [settings, cards, facts] = await Promise.all([loadSettings({ fresh }), loadKnowledge({ fresh }), loadSiteFacts({ fresh })]);
    const { profile, keys } = settings;

    const { history, message } = withPendingMessage(normalizeHistory(input.history), input.message.slice(0, MESSAGE_MAX_CHARS));
    const query = buildRetrievalQuery(message, history.map((t) => t.text));
    const leads = createLeadRecorder({
        test: !!input.test,
        sessionId: input.sessionId,
        userId: input.userId,
        userEmail: input.userEmail,
        page: input.visitor.page,
        isOwnerPhone: (phone) => facts.ownerPhones.some((own) => samePhone(own, phone)),
    });

    const promptBase: Omit<PromptInput, "cards" | "partialKnowledge"> = {
        profile,
        facts,
        visitor: input.visitor,
        openingMessage: profile.welcomeMessage ? fillWelcome(profile.welcomeMessage, input.visitor.name) : undefined,
        latestMessage: input.message,
    };
    const promptFor = (selection: KnowledgeSelection, extra: Partial<PromptInput> = {}) =>
        buildSystemPrompt({ ...promptBase, cards: selection.cards, partialKnowledge: selection.usage.mode === "relevant", ...extra });

    const attempts: Attempt[] = [];

    // A phone number in the new message means the visitor wants to be contacted: the model must
    // run save_lead first (it fills in the fields, or learns what's missing), then it replies.
    const forceTool = mentionsPhoneNumber(input.message, facts.ownerPhones) ? SAVE_LEAD_TOOL.name : undefined;

    /** Turns a raw model result into the final reply (handles the <lead> tag fallback). */
    const finish = async (result: ProviderResult, provider: string, model: string, selection: KnowledgeSelection, systemPrompt: string): Promise<AssistantOutput> => {
        const tagged = parseLeadTag(result.text);
        if (tagged) await leads.fromTag(tagged);
        const reply = cleanReply(result.text);
        if (!reply) throw new ProviderError(0, "Reply was empty");
        return {
            reply,
            provider,
            model,
            lead: leads.last,
            debug: {
                provider,
                model,
                attempts,
                knowledge: selection.usage,
                promptChars: systemPrompt.length,
                systemPrompt,
                toolCalls: result.toolCalls,
                lead: leads.last,
                ms: Date.now() - started,
                settingsFromDatabase: settings.fromDatabase,
            },
        };
    };

    const record = (provider: string, model: string, since: number, error: unknown) => {
        const status = error instanceof ProviderError && error.status ? `${error.status} ` : "";
        const text = error instanceof Error ? error.message : String(error);
        attempts.push({ provider, model, error: `${status}${text}`.slice(0, 240), ms: Date.now() - since });
    };

    // 1. Gemini: the dashboard model, then the fallbacks
    if (keys.gemini) {
        const selection = selectKnowledge(cards, query, {
            allCardsMaxChars: KNOWLEDGE_LIMITS.allCardsMaxChars,
            budgetChars: KNOWLEDGE_LIMITS.relevantMaxChars,
        });
        const systemPrompt = promptFor(selection);
        const firstModel = (input.test && input.model?.trim()) || profile.modelName;
        for (const model of unique([firstModel, ...GEMINI_FALLBACK_MODELS])) {
            if (Date.now() - started > DEADLINE_MS) break;
            const since = Date.now();
            try {
                const result = await runGemini(keys.gemini, model, {
                    systemPrompt,
                    history,
                    message,
                    tools: [SAVE_LEAD_TOOL],
                    executeTool: leads.execute,
                    timeoutMs: GEMINI_TIMEOUT_MS,
                    forceTool,
                });
                return await finish(result, "gemini", model, selection, systemPrompt);
            } catch (error) {
                record("gemini", model, since, error);
            }
        }
    }

    // 2. OpenAI-compatible backups, with a smaller prompt (their free tiers have tight token limits)
    const compactSelection = selectKnowledge(cards, query, {
        allCardsMaxChars: KNOWLEDGE_LIMITS.compactMaxChars,
        budgetChars: KNOWLEDGE_LIMITS.compactMaxChars,
        maxRelevant: 8,
    });
    const compactPrompt = promptFor(compactSelection, { compact: true });
    let taggedPrompt: string | null = null;

    for (const endpoint of backupEndpoints(keys)) {
        if (Date.now() - started > DEADLINE_MS) break;
        const since = Date.now();
        const request = { history, message, executeTool: leads.execute, timeoutMs: BACKUP_TIMEOUT_MS };
        try {
            const result = await runCompatible(endpoint, { ...request, systemPrompt: compactPrompt, tools: [SAVE_LEAD_TOOL], forceTool });
            return await finish(result, endpoint.provider, endpoint.model, compactSelection, compactPrompt);
        } catch (error) {
            const toolsRejected = error instanceof ProviderError && (error.status === 400 || error.status === 404) && /tool|function/i.test(error.message);
            if (!toolsRejected) {
                record(endpoint.provider, endpoint.model, since, error);
                continue;
            }
            // This model can't use tools: retry once with the text-tag fallback for leads
            try {
                taggedPrompt ??= promptFor(compactSelection, { compact: true, leadTagFallback: true });
                const result = await runCompatible(endpoint, { ...request, systemPrompt: taggedPrompt, tools: [] });
                return await finish(result, endpoint.provider, `${endpoint.model} (no tools)`, compactSelection, taggedPrompt);
            } catch (retryError) {
                record(endpoint.provider, endpoint.model, since, retryError);
            }
        }
    }

    throw new AssistantUnavailableError(attempts);
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function backupEndpoints(keys: ProviderKeys): CompatibleEndpoint[] {
    const list: CompatibleEndpoint[] = [];
    if (keys.groq) {
        list.push(
            { provider: "groq", url: GROQ_URL, apiKey: keys.groq, model: "openai/gpt-oss-120b", extra: { temperature: 0.6, reasoning_effort: "low" } },
            { provider: "groq", url: GROQ_URL, apiKey: keys.groq, model: "qwen/qwen3.8-27b", extra: { temperature: 0.6 } }
        );
    }
    if (keys.openRouter) {
        const headers = { "X-Title": "Website assistant" };
        list.push(
            { provider: "openrouter", url: OPENROUTER_URL, apiKey: keys.openRouter, model: "qwen/qwen3.8-27b:free", extra: { temperature: 0.6 }, headers },
            { provider: "openrouter", url: OPENROUTER_URL, apiKey: keys.openRouter, model: "google/gemma-4-31b-it:free", extra: { temperature: 0.6 }, headers }
        );
    }
    if (keys.openai) {
        list.push({ provider: "openai", url: OPENAI_URL, apiKey: keys.openai, model: "gpt-5-mini" });
    }
    return list;
}

/**
 * True when the text contains something that looks like a visitor's phone number: 8–15 digits
 * (Latin or Arabic numerals, with optional +, spaces, dashes or brackets) that start with "+" or
 * "0" or have at least 10 digits — so dates ("2026-10-15") and amounts don't count. The owner's
 * own numbers are ignored.
 */
export function mentionsPhoneNumber(text: string, ignore: string[] = []): boolean {
    const latin = text
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
    const candidates = latin.match(/\+?\d[\d\s().-]{5,22}\d/g) || [];
    return candidates.some((c) => {
        const digits = c.replace(/\D/g, "");
        if (digits.length < 8 || digits.length > 15) return false;
        if (!(c.startsWith("+") || c.startsWith("0") || digits.length >= 10)) return false;
        return !ignore.some((own) => samePhone(own, digits));
    });
}

/** Compares the last 9 digits, so "+20 102 453 1452", "201024531452" and "01024531452" match. */
export function samePhone(a: string, b: string): boolean {
    const x = a.replace(/\D/g, "");
    const y = b.replace(/\D/g, "");
    return x.length >= 7 && y.length >= 7 && x.slice(-9) === y.slice(-9);
}

function unique(models: string[]): string[] {
    return [...new Set(models.map((m) => m.trim().replace(/^models\//, "")).filter(Boolean))];
}
