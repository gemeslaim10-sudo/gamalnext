"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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

            // Create/Update User Document
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: user.displayName || "Anonymous",
                email: user.email,
                photoURL: user.photoURL,
                lastLoginAt: serverTimestamp(),
                // Only set createdAt if it doesn't exist (merge won't overwrite existing fields but we want to be sure)
            }, { merge: true });

        } catch (error: any) {
            console.error("Error signing in with Google", error);
            let errorMessage = "Failed to sign in with Google.";

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Sign-in cancelled by user.";
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = "Sign-in popup was blocked by the browser.";
            } else if (error.code === 'auth/unauthorized-domain') {
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
