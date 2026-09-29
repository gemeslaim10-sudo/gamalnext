import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { refreshSite } from "@/lib/refreshSite";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { SettingsForm } from "./types";

export function useSettings() {
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<SettingsForm>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch from the new settings document
                const docRef = doc(db, "site_content", "settings");
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data() as SettingsForm;
                    setValue("siteName", data.siteName || "GTech");
                    setValue("siteDescription", data.siteDescription || "");
                    setValue("siteLogo", data.siteLogo || "");
                    setValue("ownerName", data.ownerName || "");
                    setValue("ownerTitle", data.ownerTitle || "");
                    setValue("ownerBio", data.ownerBio || "");
                    setValue("ownerRole", data.ownerRole || "");
                    setValue("ownerLocation", data.ownerLocation || "");
                    setValue("availabilityStatus", data.availabilityStatus ?? "Available");
                    setValue("ownerBadges", data.ownerBadges || "");
                    setValue("githubUrl", data.githubUrl || "");
                    setValue("linkedinUrl", data.linkedinUrl || "");
                    setValue("emailAddress", data.emailAddress || "");
                    setValue("phoneDisplay", data.phoneDisplay || "");
                    setValue("whatsappNumber", data.whatsappNumber || "");
                } else {
                    // Fetch fallback from hero document in case they already set it there
                    const oldRef = doc(db, "site_content", "hero");
                    const oldSnap = await getDoc(oldRef);
                    if (oldSnap.exists()) {
                        const oldData = oldSnap.data() as Partial<SettingsForm>;
                        setValue("siteName", oldData.siteName || "GTech");
                        setValue("siteLogo", oldData.siteLogo || "");
                    } else {
                        setValue("siteName", "GTech");
                        setValue("siteLogo", "");
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading settings");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: SettingsForm) => {
        try {
            await setDoc(doc(db, "site_content", "settings"), data, { merge: true });
            await refreshSite();
            toast.success("Settings updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings");
        }
    };

    return {
        register,
        handleSubmit,
        setValue,
        watch,
        isSubmitting,
        loading,
        onSubmit
    };
}
