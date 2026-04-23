"use client";

import React, { createContext, useContext } from "react";

const BrandingContext = createContext<any>(null);

export function BrandingProvider({ children, initialBranding }: { children: React.ReactNode, initialBranding: any }) {
    return (
        <BrandingContext.Provider value={initialBranding}>
            {children}
        </BrandingContext.Provider>
    );
}

export function useBrandingContext() {
    return useContext(BrandingContext);
}
