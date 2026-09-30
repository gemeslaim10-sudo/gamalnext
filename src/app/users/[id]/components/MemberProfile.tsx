"use client";

import { UserX } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCopy } from "@/components/providers/CopyProvider";
import { ButtonLink, EmptyState, Page } from "@/components/ui";
import type { UserArticle, UserProfile } from "../types";
import { UserArticlesList } from "./UserArticlesList";
import { UserProfileCard } from "./UserProfileCard";

interface MemberProfileProps {
    id: string;
    /** Read on the server; null when there's no such member */
    profile: UserProfile | null;
    articles: UserArticle[];
}

/** The member page; the signed-in owner also gets their shortcuts (write, edit profile…). */
export function MemberProfile({ id, profile, articles }: MemberProfileProps) {
    const t = useCopy();
    const { user } = useAuth();

    if (!profile) {
        return (
            <Page>
                <EmptyState
                    icon={<UserX />}
                    title={t("blog.userNotFound")}
                    action={
                        <ButtonLink href="/" variant="secondary">
                            {t("blog.userGoHome")}
                        </ButtonLink>
                    }
                />
            </Page>
        );
    }

    return (
        <Page>
            <UserProfileCard profile={profile} currentUser={user} profileId={id} />
            <UserArticlesList articles={articles} />
        </Page>
    );
}
