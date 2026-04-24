import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

export function useAuthModal(onClose: () => void) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { signInWithGoogle } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const getFriendlyErrorMessage = (error: any) => {
        const msg = error.code || error.message || "";
        if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password") || msg.includes("auth/user-not-found")) {
            return "Invalid credentials.";
        }
        if (msg.includes("auth/email-already-in-use")) {
            return "Email is already in use.";
        }
        if (msg.includes("auth/weak-password")) {
            return "Password must be at least 6 characters.";
        }
        return "Authentication failed, please try again.";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Welcome back");
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
                toast.success("Account created successfully.");
            }
            onClose();
        } catch (err: any) {
            console.error("Auth Error:", err);
            toast.error(getFriendlyErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await signInWithGoogle();
            onClose();
            toast.success("Logged in with Google successfully.");
        } catch (e: any) {
            console.error("Google Signin Error:", e);
            const errorCode = e.code || e.message || "";
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
        isLogin,
        setIsLogin,
        loading,
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
