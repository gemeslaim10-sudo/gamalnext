import { AI_SETTINGS_DOC, resolveProfile, type AssistantProfile } from "@/lib/ai/assistant/shared";

/** `settings/ai`: the assistant's profile (edited section by section under /admin/ai) and the provider keys. */
export const AI_SETTINGS_PATH = `${AI_SETTINGS_DOC.collection}/${AI_SETTINGS_DOC.id}` as const;

export const KEY_FIELDS = ["geminiKey", "groqKey", "openRouterKey", "openaiKey"] as const;
export type KeyField = (typeof KEY_FIELDS)[number];

export type AiSettings = AssistantProfile & Record<KeyField, string>;

/**
 * The stored document as the editors show it. resolveProfile fills defaults and maps the old
 * `systemRole` / `prompt` / `stylePrompt` texts into the new fields; the old fields themselves are
 * never written or removed (every save merges only the fields of one section).
 * Defined at module level so all sections share one cached copy (see useAdminDoc).
 */
export function normalizeAiSettings(raw: Record<string, unknown> | null): AiSettings {
    const keys = Object.fromEntries(KEY_FIELDS.map((key) => [key, typeof raw?.[key] === "string" ? (raw[key] as string) : ""])) as Record<KeyField, string>;
    return { ...resolveProfile(raw), ...keys };
}

/** The assistant section of the dashboard: every screen under /admin/ai links back here. */
export const AI_CRUMBS = [{ label: "إعدادات المساعد", href: "/admin/ai" }];
