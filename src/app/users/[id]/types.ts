import type { ArticleCardData } from "@/components/articles/ArticleCard";

/** Only the public part of a member's account reaches this page (never the email) — see src/lib/members/server.ts. */
export type { PublicMember as UserProfile } from "@/lib/members/server";

export type UserArticle = ArticleCardData;
