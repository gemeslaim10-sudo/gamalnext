"use client";

import { UserX } from "lucide-react";
import { useCopy } from "@/components/providers/CopyProvider";
import { ButtonLink, EmptyState, LoadingBlock, Page } from "@/components/ui";

import { useUserProfile } from "./useUserProfile";
import { UserProfileCard } from "./components/UserProfileCard";
import { UserArticlesList } from "./components/UserArticlesList";

export default function UserProfilePage() {
    const t = useCopy();
    const { id, user, profile, articles, loading } = useUserProfile();

    if (loading) {
        return (
            <Page>
                <LoadingBlock label={t("blog.loading")} />
            </Page>
        );
    }

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
