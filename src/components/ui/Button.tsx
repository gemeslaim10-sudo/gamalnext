import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

const BASE =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium " +
    "transition duration-(--motion-fast) ease-out active:scale-[0.97] " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const VARIANTS: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
    secondary: "border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-hover",
    ghost: "text-muted hover:bg-surface-hover hover:text-foreground",
    danger: "border border-danger/30 text-danger hover:bg-danger/10",
};

const SIZES: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
    icon: "size-10",
    "icon-sm": "size-8",
};

interface VariantProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

/** Class string for anything that should look like a button (links, labels…). */
export function buttonVariants({ variant = "primary", size = "md", className }: VariantProps = {}) {
    return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

type ButtonProps = ComponentProps<"button"> & VariantProps;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
    return <button type={type} className={buttonVariants({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "href"> &
    VariantProps & {
        href: string;
        /** Opens in a new tab with safe rel attributes */
        external?: boolean;
    };

export function ButtonLink({ href, external, variant, size, className, ...props }: ButtonLinkProps) {
    const classes = buttonVariants({ variant, size, className });
    if (external) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props} />;
    }
    return <Link href={href} className={classes} {...props} />;
}

type BackLinkProps = { children: ReactNode; className?: string } & (
    | { href: string; onClick?: never }
    | { href?: never; onClick: () => void }
);

/** "← Back to …" shown above a page title. Pass `href`, or `onClick` for history back. */
export function BackLink({ href, onClick, children, className }: BackLinkProps) {
    const classes = cn("-ml-3 mb-6", className);
    const content = (
        <>
            <ArrowLeft />
            {children}
        </>
    );
    if (href) {
        return (
            <ButtonLink href={href} variant="ghost" size="sm" className={classes}>
                {content}
            </ButtonLink>
        );
    }
    return (
        <Button variant="ghost" size="sm" className={classes} onClick={onClick}>
            {content}
        </Button>
    );
}
