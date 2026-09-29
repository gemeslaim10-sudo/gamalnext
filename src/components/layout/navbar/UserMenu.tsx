"use client";

import type { User } from "firebase/auth";
import { LogOut } from "lucide-react";
import { getAccountLinks } from "@/config/navigation";
import { ALLOWED_ADMINS } from "@/lib/constants";
import { Avatar, Dropdown, MenuDivider, MenuItem } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

export function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
    const isAdmin = !!user.email && ALLOWED_ADMINS.includes(user.email);
    const t = useCopy();

    return (
        <Dropdown
            className="w-60"
            trigger={({ open, toggle }) => (
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    aria-label="Account menu"
                    className="flex rounded-full transition-opacity hover:opacity-80"
                >
                    <Avatar src={user.photoURL} alt={user.displayName || "Account"} size={32} />
                </button>
            )}
        >
            {(close) => (
                <>
                    <div className="px-3 py-2">
                        <p className="truncate text-sm font-medium text-foreground">{user.displayName || "Account"}</p>
                        <p className="truncate text-xs text-subtle">{user.email}</p>
                    </div>
                    <MenuDivider />
                    {getAccountLinks(user.uid, isAdmin).map((link) => (
                        <MenuItem key={link.href} href={link.href} onClick={close}>
                            {t(link.labelKey)}
                        </MenuItem>
                    ))}
                    <MenuDivider />
                    <MenuItem
                        danger
                        onClick={() => {
                            close();
                            onLogout();
                        }}
                    >
                        <LogOut /> {t("nav.logout")}
                    </MenuItem>
                </>
            )}
        </Dropdown>
    );
}
