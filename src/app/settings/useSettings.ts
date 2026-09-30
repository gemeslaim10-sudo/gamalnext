import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteUser } from "firebase/auth";
import { openCloudinaryWidget } from "@/lib/cloudinary";
import { refreshSite } from "@/lib/refreshSite";
import { useCopy } from "@/components/providers/CopyProvider";

export interface SettingsFormData {
    name: string;
    bio: string;
    location: string;
    jobTitle: string;
    socialStatus: string;
    gender: string;
    photoURL: string;
}

export function useSettings() {
    const { user } = useAuth();
    const router = useRouter();
    const t = useCopy();
    // Whose saved profile is in the form. Until it matches the signed-in user the page keeps its
    // loading state, so the form never shows empty fields that fill in a moment later.
    const [loadedUid, setLoadedUid] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<SettingsFormData>({
        name: "",
        bio: "",
        location: "",
        jobTitle: "",
        socialStatus: "Single",
        gender: "Male",
        photoURL: ""
    });

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        const fetchUserData = async () => {
            try {
                const snap = await getDoc(doc(db, "users", user.uid));
                if (!cancelled && snap.exists()) {
                    const data = snap.data();
                    setFormData({
                        name: data.name || user.displayName || "",
                        bio: data.bio || "",
                        location: data.location || "",
                        jobTitle: data.jobTitle || "",
                        socialStatus: data.socialStatus || "Single",
                        gender: data.gender || "Male",
                        photoURL: data.photoURL || user.photoURL || ""
                    });
                }
            } catch (error) {
                console.error("Error loading profile:", error);
                if (!cancelled) toast.error(t("account.settingsLoadFailed"));
            } finally {
                if (!cancelled) setLoadedUid(user.uid);
            }
        };
        fetchUserData();
        return () => {
            cancelled = true;
        };
    }, [user, t]);

    const loading = deleting || (!!user && loadedUid !== user.uid);

    const handlePhotoUpload = () => {
        openCloudinaryWidget(
            (url) => {
                if (url) {
                    const singleUrl = Array.isArray(url) ? url[0] : url;
                    setFormData(prev => ({ ...prev, photoURL: singleUrl }));
                }
            },
            (error) => {
                console.error("Photo upload error:", error);
                toast.error(t("account.settingsPhotoFailed"));
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                ...formData,
                updatedAt: new Date()
            });
            // The public profile page is cached; show the new details there right away
            void refreshSite({ memberId: user.uid });
            toast.success(t("account.settingsSaved"));
        } catch (error) {
            console.error(error);
            toast.error(t("account.settingsSaveFailed"));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        if (!confirm(t("account.settingsDeleteConfirm"))) {
            return;
        }

        if (!confirm(t("account.settingsDeleteConfirmFinal"))) {
            return;
        }

        try {
            setDeleting(true);
            // 1. Delete Firestore Document
            await deleteDoc(doc(db, "users", user.uid));
            // Take the cached profile page down too (needs the account, so before it's deleted)
            await refreshSite({ memberId: user.uid });

            // 2. Delete Auth User
            await deleteUser(user);

            // 3. Redirect
            router.push("/");
            // Force reload to clear any state
            setTimeout(() => window.location.reload(), 500);

        } catch (error: unknown) {
            console.error("Error deleting account:", error);
            const firebaseError = error as { code?: string };
            if (firebaseError.code === 'auth/requires-recent-login') {
                toast.error(t("account.settingsDeleteRelogin"));
            } else {
                toast.error(t("account.settingsDeleteFailed"));
            }
            setDeleting(false);
        }
    };

    return {
        user,
        loading,
        saving,
        formData,
        setFormData,
        handlePhotoUpload,
        handleSubmit,
        handleDeleteAccount
    };
}
