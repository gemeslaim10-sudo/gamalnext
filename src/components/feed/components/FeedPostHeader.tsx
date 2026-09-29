import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { Avatar, buttonVariants } from "@/components/ui";
import { formatFeedDate, getLabelKeyForType } from "../helpers";
import { useCopy } from "@/components/providers/CopyProvider";
import type { FeedItem } from "../types";

interface FeedPostHeaderProps {
    item: FeedItem;
    siteLogo?: string;
    siteName?: string;
}

export function FeedPostHeader({ item, siteLogo, siteName }: FeedPostHeaderProps) {
    const { user } = useAuth();
    const t = useCopy();

    // Only community posts can be edited, by their author or an admin
    const isAdmin = !!(user?.email && ALLOWED_ADMINS.includes(user.email));
    const isOwner = user?.uid === item.userId;
    const canEdit = item.type === "post" && (isAdmin || isOwner);

    // Projects, articles and the owner's own posts show the owner's photo
    const showOwnerPhoto = item.type !== "post" || item.byOwner;
    const photo = showOwnerPhoto ? siteLogo : item.authorPhoto;
    const author = item.author || "Gamal Abdelaty";

    return (
        <div className="flex items-center gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
            <Avatar src={photo} alt={showOwnerPhoto ? siteName || author : author} size={36} />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{author}</p>
                <p className="text-xs text-subtle">
                    {t(getLabelKeyForType(item.type))} · {formatFeedDate(item.createdAt)}
                </p>
            </div>
            {canEdit && (
                <Link
                    href={`/edit/${item.id}`}
                    aria-label="Edit post"
                    title="Edit post"
                    className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                >
                    <Pencil />
                </Link>
            )}
        </div>
    );
}
