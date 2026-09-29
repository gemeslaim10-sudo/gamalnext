"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Field, Input, Modal, Spinner } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";
import { useAuthModal } from "./hooks/useAuthModal";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/** Log in / sign up dialog. The navbar owns it; other pages open it with the "open-auth-modal" event. */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const {
        isLogin, setIsLogin, loading, error, clearError, email, setEmail, password, setPassword,
        name, setName, handleSubmit, handleGoogle
    } = useAuthModal(onClose);
    const t = useCopy();
    // Which button started the current request, so only that one shows a spinner
    const [pending, setPending] = useState<"email" | "google">("email");

    const close = () => {
        clearError();
        onClose();
    };

    const switchMode = () => {
        clearError();
        setIsLogin(!isLogin);
    };

    const submit = (e: FormEvent) => {
        setPending("email");
        handleSubmit(e);
    };

    const continueWithGoogle = () => {
        setPending("google");
        handleGoogle();
    };

    return (
        <Modal
            open={isOpen}
            onClose={close}
            title={isLogin ? t("account.authLoginTitle") : t("account.authSignupTitle")}
            size="sm"
        >
            <div className="flex flex-col gap-5 p-5">
                <form onSubmit={submit} noValidate className="flex flex-col gap-4">
                    {error && <Alert variant="danger">{error}</Alert>}

                    {!isLogin && (
                        <Field label={t("account.authNameLabel")} htmlFor="auth-name">
                            <Input
                                id="auth-name"
                                type="text"
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t("account.authNamePlaceholder")}
                                required
                            />
                        </Field>
                    )}
                    <Field label={t("account.authEmailLabel")} htmlFor="auth-email">
                        <Input
                            id="auth-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("account.authEmailPlaceholder")}
                            required
                        />
                    </Field>
                    <Field
                        label={t("account.authPasswordLabel")}
                        htmlFor="auth-password"
                        hint={isLogin ? undefined : t("account.authPasswordHint")}
                    >
                        <Input
                            id="auth-password"
                            type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </Field>

                    <Button type="submit" className="mt-1 w-full" disabled={loading}>
                        {loading && pending === "email" && <Spinner className="size-4 text-primary-foreground" />}
                        {isLogin ? t("account.authLoginButton") : t("account.authSignupButton")}
                    </Button>
                </form>

                <div className="flex items-center gap-3 text-xs text-subtle">
                    <span className="h-px flex-1 bg-border" />
                    {t("account.authOr")}
                    <span className="h-px flex-1 bg-border" />
                </div>

                <Button variant="secondary" className="w-full" onClick={continueWithGoogle} disabled={loading}>
                    {loading && pending === "google" ? <Spinner className="size-4" /> : <GoogleIcon />}
                    {t("account.authGoogle")}
                </Button>

                <p className="text-center text-sm text-muted">
                    {isLogin ? t("account.authNoAccount") : t("account.authHaveAccount")}{" "}
                    <button type="button" onClick={switchMode} className="font-medium text-foreground hover:underline">
                        {isLogin ? t("account.authToSignup") : t("account.authToLogin")}
                    </button>
                </p>
            </div>
        </Modal>
    );
}

/** Monochrome Google "G" mark (follows the button's text color). */
function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}
