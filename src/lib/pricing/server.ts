import { cache } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_PRICING, PRICING_COLLECTION, PRICING_DOC_ID } from "./defaults";
import type { PricingContent } from "./types";
import { normalizePricing } from "./utils";

export type PricingLoadResult =
    | { status: "ok"; content: PricingContent }
    /** The document doesn't exist (never saved) */
    | { status: "missing" }
    /** The database couldn't be read; `content` is the built-in safety net */
    | { status: "error"; content: PricingContent };

/**
 * Reads `site_content/pricing` for the /pricing page (server only).
 * Wrapped in React `cache` so `generateMetadata` and the page share one read per request.
 */
export const loadPricing = cache(async (): Promise<PricingLoadResult> => {
    try {
        const snap = await getDoc(doc(db, PRICING_COLLECTION, PRICING_DOC_ID));
        if (!snap.exists()) return { status: "missing" };
        return { status: "ok", content: normalizePricing(snap.data()) };
    } catch (error) {
        console.error(`Error reading ${PRICING_COLLECTION}/${PRICING_DOC_ID}:`, error);
        return { status: "error", content: DEFAULT_PRICING };
    }
});
