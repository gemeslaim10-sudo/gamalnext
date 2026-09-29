"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui";

/** Secondary "go back" button for server-rendered pages (the 404 page). */
export function GoBackButton({ children }: { children: ReactNode }) {
    return (
        <Button variant="secondary" onClick={() => window.history.back()}>
            {children}
        </Button>
    );
}
