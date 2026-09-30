"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase-app";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { Alert, Avatar, Button, Card, Field, Input } from "@/components/ui";

function loginError(error: unknown) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        return "الإيميل أو كلمة السر مش صح.";
    }
    if (code === "auth/too-many-requests") return "محاولات كتير ورا بعض. استنى شوية وجرّب تاني.";
    return "ماقدرناش ندخّلك. اتأكد من الاتصال وجرّب تاني.";
}

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const branding = useBrandingContext();

    // Already signed in: go straight to the dashboard
    useEffect(() => {
        if (user) router.replace("/admin");
    }, [user, router]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (err: unknown) {
            console.error(err);
            setError(loginError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (user) return null;

    const siteName = branding?.siteName || "GTech";

    return (
        // The dashboard is Arabic, read right to left (this page is outside its frame)
        <div dir="rtl" lang="ar" className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex flex-col items-center gap-3 text-center">
                    <Avatar src={branding?.siteLogo} alt={siteName} size={40} priority />
                    <p className="text-sm font-semibold text-foreground">{siteName}</p>
                </div>

                <Card padding="lg">
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">دخول لوحة التحكم</h1>
                    <p className="mt-1.5 text-sm text-muted">الدخول للأدمن بس.</p>

                    <form onSubmit={handleLogin} className="mt-6 space-y-4">
                        <Field label="الإيميل" htmlFor="admin-email">
                            <Input
                                id="admin-email"
                                type="email"
                                dir="ltr"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@gamaltech.info"
                            />
                        </Field>

                        <Field label="كلمة السر" htmlFor="admin-password">
                            <Input
                                id="admin-password"
                                type="password"
                                dir="ltr"
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </Field>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "جاري الدخول…" : "دخول"}
                        </Button>
                    </form>
                </Card>

                <div className="mt-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground">
                        {/* Points back in the right-to-left layout */}
                        <ArrowRight aria-hidden className="size-4 ltr:rotate-180" />
                        الرجوع للموقع
                    </Link>
                </div>
            </div>
        </div>
    );
}
