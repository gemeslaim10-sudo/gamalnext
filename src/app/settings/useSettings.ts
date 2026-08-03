import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteUser } from "firebase/auth";
import { openCloudinaryWidget } from "@/lib/cloudinary";

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
    const [loading, setLoading] = useState(true);
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
        async function fetchUserData() {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
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
            }
            setLoading(false);
        }
        fetchUserData();
    }, [user]);

    const handlePhotoUpload = () => {
        openCloudinaryWidget(
            (url) => {
                if (url) {
                    const singleUrl = Array.isArray(url) ? url[0] : url;
                    setFormData(prev => ({ ...prev, photoURL: singleUrl }));
                }
            },
            (error) => {
                toast.error(error.message || "فشل فتح نافذة رفع الصور");
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
            toast.success("تم تحديث الملف الشخصي بنجاح! 🎉");
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء الحفظ.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        if (!confirm("هل أنت متأكد أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.")) {
            return;
        }

        if (!confirm("تحذير أخير: سيتم حذف جميع بياناتك ومقالاتك. هل أنت متأكد تماماً؟")) {
            return;
        }

        try {
            setLoading(true);
            // 1. Delete Firestore Document
            await deleteDoc(doc(db, "users", user.uid));

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
                toast.error("لحذف الحساب، يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى للتحقق من هويتك.");
            } else {
                toast.error("حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى.");
            }
            setLoading(false);
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
