import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export interface ContentForm {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    whatsappNumber: string;
    resumeLink: string;
    avatarImage: string;
}

export function useAdminContent() {
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<ContentForm>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const docRef = doc(db, "site_content", "hero");
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data() as ContentForm;
                    setValue("heroTitle", data.heroTitle);
                    setValue("heroSubtitle", data.heroSubtitle || "محلل بيانات & مطور ويب مدعوم بالذكاء الاصطناعي");
                    setValue("heroDescription", data.heroDescription || "");
                    setValue("whatsappNumber", data.whatsappNumber || "201024531452");
                    setValue("resumeLink", data.resumeLink || "#projects");
                    setValue("avatarImage", data.avatarImage || "");
                } else {
                    setValue("heroTitle", "جمال عبد العاطي");
                    setValue("heroSubtitle", "محلل بيانات & مطور ويب مدعوم بالذكاء الاصطناعي");
                    setValue("heroDescription", "أحول البيانات المعقدة إلى رؤى واضحة، وأبني مواقع ويب ديناميكية تتحدث مع قواعد البيانات وتفهم العملاء باستخدام أحدث تقنيات Gemini AI.");
                    setValue("whatsappNumber", "201024531452");
                    setValue("resumeLink", "#projects");
                    setValue("avatarImage", "");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading content");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: ContentForm) => {
        try {
            await setDoc(doc(db, "site_content", "hero"), data);
            toast.success("Content updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update content");
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
