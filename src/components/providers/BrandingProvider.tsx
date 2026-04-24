"use client";

import React, { createContext, useContext } from "react";

export interface BrandingSettings {
    siteName?: string;
    siteLogo?: string;
    [key: string]: unknown;
}

const BrandingContext = createContext<BrandingSettings | null>(null);

export function BrandingProvider({ children, initialBranding }: { children: React.ReactNode, initialBranding: BrandingSettings | null }) {
    return (
        <BrandingContext.Provider value={initialBranding}>
            {children}
        </BrandingContext.Provider>
    );
}

export function useBrandingContext() {
    return useContext(BrandingContext);
}
