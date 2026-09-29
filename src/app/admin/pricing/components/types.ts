import type { PricingContent } from "@/lib/pricing/types";

/** Applies a change to the editor's draft (always from the latest draft). */
export type UpdateContent = (fn: (draft: PricingContent) => PricingContent) => void;
