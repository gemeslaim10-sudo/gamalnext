// Dashboard access to `site_content/pricing` (client SDK, signed-in admin).
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PRICING_COLLECTION, PRICING_DOC_ID } from "./defaults";
import type { PricingContent } from "./types";
import { normalizePricing } from "./utils";

const pricingRef = () => doc(db, PRICING_COLLECTION, PRICING_DOC_ID);

export type PricingFetchResult =
    | { exists: true; content: PricingContent; updatedAt: Date | null }
    | { exists: false };

/** Throws when the read fails, so the editor never mistakes an error for "no content yet". */
export async function fetchPricing(): Promise<PricingFetchResult> {
    const snap = await getDoc(pricingRef());
    if (!snap.exists()) return { exists: false };
    const data = snap.data();
    const stamp = data.updatedAt as { toDate?: () => Date } | undefined;
    return {
        exists: true,
        content: normalizePricing(data),
        updatedAt: typeof stamp?.toDate === "function" ? stamp.toDate() : null,
    };
}

/** Writes the whole document: the page shows exactly what the dashboard holds. */
export async function savePricing(content: PricingContent) {
    await setDoc(pricingRef(), { ...content, updatedAt: serverTimestamp() });
}
