"use client";

import { useEffect, useState } from "react";

/** Matches `--motion-base` in globals.css: how long closing animations run before unmount. */
export const EXIT_DURATION_MS = 220;

/**
 * Keeps an element mounted while it animates out, and flips it to "open" one frame after
 * it mounts so the CSS transition has a start state to animate from.
 *
 *   const { mounted, state } = usePresence(open);
 *   if (!mounted) return null;
 *   return <div data-state={state} className="transition-opacity data-[state=closed]:opacity-0" />;
 */
export function usePresence(open: boolean, exitMs = EXIT_DURATION_MS) {
    const [mounted, setMounted] = useState(open);
    const [entered, setEntered] = useState(false);

    // Adjusted during render (not in an effect) so opening never waits an extra frame to mount
    if (open && !mounted) setMounted(true);
    if (!open && entered) setEntered(false);

    useEffect(() => {
        if (open) {
            // Two frames let the browser paint the closed state first, so the transition has
            // something to start from. Frames pause in background tabs, so a timer backs them up
            // and the element can never stay hidden.
            let done = false;
            const enter = () => {
                if (done) return;
                done = true;
                setEntered(true);
            };
            let second = 0;
            const first = requestAnimationFrame(() => {
                second = requestAnimationFrame(enter);
            });
            const fallback = window.setTimeout(enter, 60);
            return () => {
                cancelAnimationFrame(first);
                cancelAnimationFrame(second);
                window.clearTimeout(fallback);
            };
        }
        const timer = window.setTimeout(() => setMounted(false), exitMs);
        return () => window.clearTimeout(timer);
    }, [open, exitMs]);

    const visible = open && entered;
    return { mounted, visible, state: visible ? ("open" as const) : ("closed" as const) };
}
