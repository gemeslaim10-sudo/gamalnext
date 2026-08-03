import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export function useAuthModal(onClose: () => void) {
    const [loading, setLoading] = useState(false);
    const { signInWithGoogle } = useAuth();

    const handleGoogle = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await signInWithGoogle();
            onClose();
            toast.success("Logged in with Google successfully.");
        } catch (e) {
            console.error("Google Signin Error:", e);
            const errorCode = (e as { code?: string; message?: string }).code || (e as { message?: string }).message || "";
            if (errorCode.includes("auth/popup-closed-by-user") || errorCode.includes("auth/cancelled-popup-request")) {
                toast("Login cancelled.", { icon: "ℹ️" });
            } else if (errorCode.includes("auth/unauthorized-domain")) {
                toast.error("Unauthorized domain. Please add it to Firebase settings.");
            } else {
                toast.error("Google login failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleGoogle
    };
}
