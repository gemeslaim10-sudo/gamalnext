// Server only — IndexNow: tells Bing (which also feeds ChatGPT search and Copilot), Yandex, Seznam,
// Naver and other participating engines that pages changed, instead of waiting for their crawlers.
import { SITE_URL } from "@/lib/constants";

/** Public by design: the same key is served at /<key>.txt (public/27d26f4166742273714405b9e3a25c39.txt). */
export const INDEXNOW_KEY = "27d26f4166742273714405b9e3a25c39";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10_000;

export type IndexNowResult =
    | { ok: true; submitted: number; status?: number }
    | { ok: false; submitted: 0; status?: number; skipped?: "not-production"; error?: string };

/** Submits pages of this site (absolute or site-relative URLs). Only the live site submits. */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
    // Preview and local builds would announce pages that don't exist on the live site yet
    if (process.env.VERCEL_ENV !== "production") return { ok: false, submitted: 0, skipped: "not-production" };

    const host = new URL(SITE_URL).host;
    const urlList = [
        ...new Set(
            urls
                .map((url) => {
                    try {
                        return new URL(url, SITE_URL);
                    } catch {
                        return null;
                    }
                })
                .filter((url): url is URL => url !== null && url.host === host)
                .map((url) => url.toString())
        ),
    ].slice(0, MAX_URLS);
    if (urlList.length === 0) return { ok: true, submitted: 0 };

    try {
        const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList }),
            signal: AbortSignal.timeout(10_000),
        });
        // 200 = accepted, 202 = accepted while the key is being checked
        return res.ok ? { ok: true, submitted: urlList.length, status: res.status } : { ok: false, submitted: 0, status: res.status };
    } catch (error) {
        return { ok: false, submitted: 0, error: error instanceof Error ? error.message : "Request failed" };
    }
}
