import { cache } from "react";
import { unstable_noStore } from "next/cache";
import { CACHE_TAGS, cached, readDoc } from "@/lib/cache";
import { DEFAULT_PRICING, PRICING_COLLECTION, PRICING_DOC_ID } from "./defaults";
import type { PricingContent } from "./types";
import { normalizePricing } from "./utils";

export type PricingLoadResult =
    | { status: "ok"; content: PricingContent }
    /** The document doesn't exist (never saved) */
    | { status: "missing" }
    /** The database couldn't be read; `content` is the built-in safety net */
    | { status: "error"; content: PricingContent };

const readPricing = cached(async () => readDoc<Record<string, unknown>>(PRICING_COLLECTION, PRICING_DOC_ID), "pricing", [CACHE_TAGS.pricing]);

/**
 * Reads `site_content/pricing` (server only), cached until the dashboard saves or clears the cache.
 * Wrapped in React `cache` so `generateMetadata` and the page share one read per request.
 */
export const loadPricing = cache(async (): Promise<PricingLoadResult> => {
    try {
        const data = await readPricing();
        if (!data) return { status: "missing" };
        return { status: "ok", content: normalizePricing(data) };
    } catch (error) {
        console.error(`Error reading ${PRICING_COLLECTION}/${PRICING_DOC_ID}:`, error);
        // The safety-net render isn't cached, so the next visitor tries the database again
        unstable_noStore();
        return { status: "error", content: DEFAULT_PRICING };
    }
});
