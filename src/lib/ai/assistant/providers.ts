// Model providers, called over plain HTTPS (no SDK) so tool calls and errors are fully under control.
//   Gemini: generateContent with function calling.
//   OpenAI-compatible (Groq, OpenRouter, OpenAI): chat/completions with tools.
import type { ChatTurn } from "./history";
import type { ToolExecutor, ToolSpec } from "./leads";

export interface ProviderRequest {
    systemPrompt: string;
    history: ChatTurn[];
    message: string;
    tools: ToolSpec[];
    executeTool: ToolExecutor;
    timeoutMs: number;
    /** Name of a tool the model must call in its first step (then it answers normally) */
    forceTool?: string;
}

export interface ProviderResult {
    text: string;
    toolCalls: number;
}

export class ProviderError extends Error {
    constructor(
        readonly status: number,
        message: string
    ) {
        super(message);
        this.name = "ProviderError";
    }
}

const MAX_TOOL_ROUNDS = 3;

// ── Gemini ────────────────────────────────────────────────────────────────────

interface GeminiPart {
    text?: string;
    thought?: boolean;
    functionCall?: { name: string; args?: Record<string, unknown>; id?: string };
    [key: string]: unknown;
}

interface GeminiContent {
    role: "user" | "model";
    parts: GeminiPart[];
}

interface GeminiResponse {
    candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[];
    promptFeedback?: { blockReason?: string };
}

export async function runGemini(apiKey: string, model: string, req: ProviderRequest): Promise<ProviderResult> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const contents: GeminiContent[] = [
        ...req.history.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
        { role: "user", parts: [{ text: req.message }] },
    ];

    let toolCalls = 0;
    let tuned = true;
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
        const forced = round === 0 && req.forceTool && req.tools.some((t) => t.name === req.forceTool);
        const body = {
            systemInstruction: { parts: [{ text: req.systemPrompt }] },
            contents,
            ...(req.tools.length ? { tools: [{ functionDeclarations: req.tools.map(toGeminiDeclaration) }] } : {}),
            ...(forced ? { toolConfig: { functionCallingConfig: { mode: "ANY", allowedFunctionNames: [req.forceTool] } } } : {}),
            generationConfig: tuned ? geminiGenerationConfig(model) : {},
        };

        let data: GeminiResponse;
        try {
            data = await postJson<GeminiResponse>(url, { "x-goog-api-key": apiKey }, body, req.timeoutMs);
        } catch (error) {
            // A model that rejects the tuning (e.g. a future alias without thinking levels) gets one plain retry
            if (tuned && error instanceof ProviderError && error.status === 400) {
                tuned = false;
                round--;
                continue;
            }
            throw error;
        }
        const candidate = data?.candidates?.[0];
        const parts = candidate?.content?.parts || [];
        if (!parts.length) {
            const reason = candidate?.finishReason || data?.promptFeedback?.blockReason || "no candidate";
            throw new ProviderError(0, `Empty response (${reason})`);
        }

        const calls = parts.filter((p) => p.functionCall);
        if (calls.length && round < MAX_TOOL_ROUNDS) {
            // Send the model turn back exactly as received: newer models attach thought signatures to it
            contents.push({ role: "model", parts });
            const responses: GeminiPart[] = [];
            for (const part of calls) {
                const call = part.functionCall!;
                toolCalls++;
                const result = await req.executeTool(call.name, call.args || {});
                responses.push({ functionResponse: { name: call.name, ...(call.id ? { id: call.id } : {}), response: result } });
            }
            contents.push({ role: "user", parts: responses });
            continue;
        }

        const text = parts
            .filter((p) => typeof p.text === "string" && !p.thought)
            .map((p) => p.text)
            .join("")
            .trim();
        if (!text) throw new ProviderError(0, `No text in response (${candidate?.finishReason || "unknown"})`);
        return { text, toolCalls };
    }
    throw new ProviderError(0, "Too many tool rounds");
}

/**
 * Gemini 2.x chats better a bit cooler. Gemini 3 and the "-latest" aliases keep their default
 * temperature (recommended by Google) and think at a low level: faster replies, same reasoning.
 */
function geminiGenerationConfig(model: string): Record<string, unknown> {
    if (/gemini-(1|2)\./.test(model)) return { temperature: 0.7 };
    return { thinkingConfig: { thinkingLevel: "low" } };
}

function toGeminiDeclaration(tool: ToolSpec) {
    return {
        name: tool.name,
        description: tool.description,
        parameters: {
            type: "OBJECT",
            properties: Object.fromEntries(
                Object.entries(tool.parameters.properties).map(([key, prop]) => [key, { type: prop.type.toUpperCase(), description: prop.description }])
            ),
            required: tool.parameters.required,
        },
    };
}

// ── OpenAI-compatible (Groq, OpenRouter, OpenAI) ──────────────────────────────

export interface CompatibleEndpoint {
    provider: "groq" | "openrouter" | "openai";
    url: string;
    apiKey: string;
    model: string;
    /** Extra body fields for this model (e.g. reasoning effort) */
    extra?: Record<string, unknown>;
    headers?: Record<string, string>;
}

type CompatibleMessage =
    | { role: "system" | "user"; content: string }
    | { role: "assistant"; content: string | null; tool_calls?: CompatibleToolCall[] }
    | { role: "tool"; tool_call_id: string; content: string };

interface CompatibleToolCall {
    id: string;
    type: "function";
    function: { name: string; arguments: string };
}

interface CompatibleResponse {
    choices?: { message?: { content?: string | null; tool_calls?: CompatibleToolCall[] } }[];
}

export async function runCompatible(endpoint: CompatibleEndpoint, req: ProviderRequest): Promise<ProviderResult> {
    const messages: CompatibleMessage[] = [
        { role: "system", content: req.systemPrompt },
        ...req.history.map((t): CompatibleMessage => (t.role === "model" ? { role: "assistant", content: t.text } : { role: "user", content: t.text })),
        { role: "user", content: req.message },
    ];

    let toolCalls = 0;
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
        const forced = round === 0 && req.forceTool && req.tools.some((t) => t.name === req.forceTool);
        const body = {
            model: endpoint.model,
            messages,
            ...(req.tools.length
                ? {
                      tools: req.tools.map((t) => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } })),
                      tool_choice: forced ? { type: "function", function: { name: req.forceTool } } : "auto",
                  }
                : {}),
            ...endpoint.extra,
        };

        const data = await postJson<CompatibleResponse>(endpoint.url, { Authorization: `Bearer ${endpoint.apiKey}`, ...endpoint.headers }, body, req.timeoutMs);
        const message = data?.choices?.[0]?.message;
        if (!message) throw new ProviderError(0, "Empty response");

        if (message.tool_calls?.length && round < MAX_TOOL_ROUNDS) {
            messages.push({ role: "assistant", content: message.content ?? null, tool_calls: message.tool_calls });
            for (const call of message.tool_calls) {
                toolCalls++;
                let args: Record<string, unknown> = {};
                try {
                    const parsed = JSON.parse(call.function?.arguments || "{}");
                    if (parsed && typeof parsed === "object") args = parsed as Record<string, unknown>;
                } catch {
                    // Malformed arguments: let the tool report the missing fields
                }
                const result = await req.executeTool(call.function?.name || "", args);
                messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
            }
            continue;
        }

        const text = (message.content || "").trim();
        if (!text) throw new ProviderError(0, "No text in response");
        return { text, toolCalls };
    }
    throw new ProviderError(0, "Too many tool rounds");
}

// ── HTTP ──────────────────────────────────────────────────────────────────────

async function postJson<T>(url: string, headers: Record<string, string>, body: unknown, timeoutMs: number): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(body),
            signal: controller.signal,
            cache: "no-store",
        });
        if (!res.ok) {
            const detail = await res.text().catch(() => "");
            throw new ProviderError(res.status, summarizeError(detail) || res.statusText);
        }
        return (await res.json()) as T;
    } catch (error) {
        if (error instanceof ProviderError) throw error;
        if (controller.signal.aborted) throw new ProviderError(0, `Timed out after ${Math.round(timeoutMs / 1000)}s`);
        throw new ProviderError(0, error instanceof Error ? error.message : String(error));
    } finally {
        clearTimeout(timer);
    }
}

function summarizeError(detail: string): string {
    try {
        const data = JSON.parse(detail);
        const message = data?.error?.message || data?.message || data?.error;
        if (typeof message === "string") return message.slice(0, 200);
    } catch {
        // not JSON
    }
    return detail.slice(0, 200);
}
