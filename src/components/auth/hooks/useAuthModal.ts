import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useCopy } from "@/components/providers/CopyProvider";

export function useAuthModal(onClose: () => void) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    // Shown inside the modal (instead of a toast) so the message sits next to the form
    const [error, setError] = useState<string | null>(null);
    const { signInWithGoogle } = useAuth();
    const t = useCopy();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const getFriendlyErrorMessage = (error: unknown) => {
        const err = error as { code?: string; message?: string };
        const msg = err.code || err.message || "";
        if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password") || msg.includes("auth/user-not-found")) {
            return t("account.authErrorCredentials");
        }
        if (msg.includes("auth/email-already-in-use")) {
            return t("account.authErrorEmailInUse");
        }
        if (msg.includes("auth/weak-password")) {
            return t("account.authErrorWeakPassword");
        }
        return t("account.authErrorGeneric");
    };

    /** Checked here instead of by the browser, so the messages come from the dashboard. */
    const validate = () => {
        if (!isLogin && name.trim().length < 2) return t("account.authErrorNameRequired");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return t("account.authErrorEmailInvalid");
        if (!password) return t("account.authErrorPasswordRequired");
        if (!isLogin && password.length < 6) return t("account.authErrorWeakPassword");
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const invalid = validate();
        setError(invalid);
        if (invalid) return;
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success(t("account.authWelcomeBack"));
            } else {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(cred.user, { displayName: name });
                await setDoc(doc(db, "users", cred.user.uid), {
                    uid: cred.user.uid,
                    name: name,
                    email: email,
                    role: "user",
                    createdAt: serverTimestamp()
                });
                toast.success(t("account.authAccountCreated"));
            }
            onClose();
        } catch (err) {
            console.error("Auth Error:", err);
            setError(getFriendlyErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            await signInWithGoogle();
            onClose();
            toast.success(t("account.authGoogleSuccess"));
        } catch (e) {
            console.error("Google Signin Error:", e);
            const errorCode = (e as { code?: string; message?: string }).code || (e as { message?: string }).message || "";
            if (errorCode.includes("auth/popup-closed-by-user") || errorCode.includes("auth/cancelled-popup-request")) {
                toast(t("account.authGoogleCancelled"));
            } else if (errorCode.includes("auth/unauthorized-domain")) {
                setError(t("account.authErrorDomain"));
            } else {
                setError(t("account.authErrorGoogle"));
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        isLogin,
        setIsLogin,
        loading,
        error,
        clearError: () => setError(null),
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        handleSubmit,
        handleGoogle
    };
}
