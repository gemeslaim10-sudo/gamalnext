"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, GoogleAuthProvider, getAdditionalUserInfo, signInWithPopup, signOut } from "firebase/auth";
import { auth, loadFirestore } from "@/lib/firebase-app";
import { reportEvent } from "@/lib/reportEvent";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const isNewUser = Boolean(getAdditionalUserInfo(result)?.isNewUser);

            // Create/Update User Document (the database library loads only now)
            const { db, doc, setDoc, serverTimestamp } = await loadFirestore();
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: user.displayName || "Anonymous",
                email: user.email,
                photoURL: user.photoURL,
                lastLoginAt: serverTimestamp(),
                // Only on the first sign-in, so the join date never moves (the dashboard sorts members by it)
                ...(isNewUser ? { createdAt: serverTimestamp() } : {}),
            }, { merge: true });

            // A brand-new account: let the owner know (if turned on in the dashboard)
            if (isNewUser) reportEvent({ event: "user.signup" });
        } catch (error) {
            console.error("Error signing in with Google", error);
            let errorMessage = "Failed to sign in with Google.";

            const firebaseError = error as { code?: string };
            if (firebaseError.code === 'auth/popup-closed-by-user') {
                errorMessage = "Sign-in cancelled by user.";
            } else if (firebaseError.code === 'auth/popup-blocked') {
                errorMessage = "Sign-in popup was blocked by the browser.";
            } else if (firebaseError.code === 'auth/unauthorized-domain') {
                errorMessage = "This domain is not authorized for Google Sign-In. Please contact support.";
            }

            setError(errorMessage);
            throw error; // Re-throw to let components handle it
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
            setError("Failed to sign out.");
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
