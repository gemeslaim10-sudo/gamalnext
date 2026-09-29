"use client";

import { Lock } from "lucide-react";
import { Button, EmptyState, Page } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

interface LoginPromptProps {
    /** Page-specific title; defaults to the "Log in required box" text from the dashboard */
    title?: string;
    description?: string;
}

/** Shown instead of a page that needs a signed-in user. The button opens the navbar's auth modal. */
export function LoginPrompt({ title, description }: LoginPromptProps) {
    const t = useCopy();
    return (
        <Page>
            <EmptyState
                className="mx-auto max-w-content"
                icon={<Lock />}
                title={title ?? t("account.loginPromptTitle")}
                description={description ?? t("account.loginPromptDescription")}
                action={
                    <Button onClick={() => document.dispatchEvent(new CustomEvent("open-auth-modal"))}>
                        {t("account.loginPromptButton")}
                    </Button>
                }
            />
        </Page>
    );
}
