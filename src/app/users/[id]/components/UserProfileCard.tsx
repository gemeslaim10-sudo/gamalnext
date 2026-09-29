import { Briefcase, Calendar, FileText, Heart, LayoutDashboard, MapPin, PenLine, UserPen } from "lucide-react";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { useCopy } from "@/components/providers/CopyProvider";
import { Avatar, ButtonLink, Card } from "@/components/ui";
import type { UserProfile } from "../types";
import type { User } from "firebase/auth";

interface UserProfileCardProps {
    profile: UserProfile;
    currentUser: User | null;
    profileId: string;
}

export function UserProfileCard({ profile, currentUser, profileId }: UserProfileCardProps) {
    const t = useCopy();
    const isOwner = currentUser && currentUser.uid === profileId;
    const isAdmin = currentUser && ALLOWED_ADMINS.includes(currentUser.email || "");
    const joined = profile.createdAt
        ? t("blog.userJoined", {
              date: new Date(profile.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          })
        : t("blog.userJoinedUnknown");

    return (
        <Card padding="lg">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <Avatar src={profile.photoURL} alt={profile.name} size={80} priority />

                <div className="min-w-0 flex-1">
                    <h1 dir="auto" className="break-words text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        {profile.name}
                    </h1>
                    {profile.jobTitle && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                            <Briefcase aria-hidden className="size-4 shrink-0 text-subtle" />
                            <span dir="auto" className="min-w-0 break-words">{profile.jobTitle}</span>
                        </p>
                    )}

                    <p dir="auto" className="mt-3 max-w-2xl whitespace-pre-line break-words text-sm leading-relaxed text-muted">
                        {profile.bio || t("blog.userNoBio")}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-subtle">
                        {profile.location && (
                            <li className="flex items-center gap-1.5">
                                <MapPin aria-hidden className="size-4 shrink-0" /> {profile.location}
                            </li>
                        )}
                        {profile.socialStatus && (
                            <li className="flex items-center gap-1.5">
                                <Heart aria-hidden className="size-4 shrink-0" /> {profile.socialStatus}
                            </li>
                        )}
                        <li className="flex items-center gap-1.5">
                            <Calendar aria-hidden className="size-4 shrink-0" /> {joined}
                        </li>
                    </ul>

                    {/* Owner shortcuts (admins also get the dashboard and the CV) */}
                    {isOwner && (
                        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                            {isAdmin && (
                                <>
                                    <ButtonLink href="/admin" variant="secondary">
                                        <LayoutDashboard /> {t("blog.userDashboard")}
                                    </ButtonLink>
                                    <ButtonLink href="/gamal-cv" external variant="secondary">
                                        <FileText /> {t("blog.userCv")}
                                    </ButtonLink>
                                </>
                            )}
                            <ButtonLink href="/write" variant="secondary">
                                <PenLine /> {t("blog.userWrite")}
                            </ButtonLink>
                            <ButtonLink href="/settings" variant="secondary">
                                <UserPen /> {t("blog.userEditProfile")}
                            </ButtonLink>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
