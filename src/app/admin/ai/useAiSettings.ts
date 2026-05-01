import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export interface AiSettingsData {
    geminiKey: string;
    groqKey: string;
    openRouterKey: string;
    openaiKey: string;
    huggingfaceKey: string;
    modelName: string;
}

export function useAiSettings() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState<AiSettingsData>({
        geminiKey: "",
        groqKey: "",
        openRouterKey: "",
        openaiKey: "",
        huggingfaceKey: "",
        modelName: "gemini-2.0-flash-exp"
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, "settings", "ai");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        geminiKey: data.geminiKey || "",
                        groqKey: data.groqKey || "",
                        openRouterKey: data.openRouterKey || "",
                        openaiKey: data.openaiKey || "",
                        huggingfaceKey: data.huggingfaceKey || "",
                        modelName: data.modelName || "gemini-2.0-flash-exp"
                    });
                }
            } catch (error) {
                console.error("Error fetching AI config:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [user, router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "ai"), {
                ...formData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            toast.success("تم حفظ إعدادات الوكيل الذكي بنجاح!");
        } catch (error) {
            console.error("Error saving AI config:", error);
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    return {
        loading,
        saving,
        formData,
        setFormData,
        handleSave
    };
}
