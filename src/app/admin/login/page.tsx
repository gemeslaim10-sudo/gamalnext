"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { Alert, Avatar, Button, Card, Field, Input } from "@/components/ui";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const branding = useBrandingContext();

    if (user) {
        router.push("/admin");
        return null;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error && 'code' in err) {
                const code = err.code as string;
                if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
                    setError("Incorrect email or password.");
                } else if (code === "auth/too-many-requests") {
                    setError("Too many attempts. Try again later.");
                } else {
                    setError("Failed to login. Please check your connection.");
                }
            } else {
                setError("Failed to login. Please check your connection.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const siteName = branding?.siteName || "GTech";

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex flex-col items-center gap-3 text-center">
                    <Avatar src={branding?.siteLogo} alt={siteName} size={40} priority />
                    <p className="text-sm font-semibold text-foreground">{siteName}</p>
                </div>

                <Card padding="lg">
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Admin Access</h1>

                    <form onSubmit={handleLogin} className="mt-6 space-y-4">
                        <Field label="Email Address" htmlFor="admin-email">
                            <Input
                                id="admin-email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@gamaltech.info"
                            />
                        </Field>

                        <Field label="Password" htmlFor="admin-password">
                            <Input
                                id="admin-password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </Field>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
