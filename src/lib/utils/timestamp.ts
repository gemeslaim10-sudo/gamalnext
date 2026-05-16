import type { FirebaseTimestamp } from "@/types";

/** Safely extract milliseconds from any Firebase timestamp shape */
export function getTimestampMs(ts: FirebaseTimestamp | undefined): number {
    if (!ts) return 0;
    if (typeof ts === 'number') return ts;
    if (typeof ts === 'string') return new Date(ts).getTime();
    if (ts instanceof Date) return ts.getTime();
    if (typeof ts === 'object') {
        if ('toMillis' in ts && typeof ts.toMillis === 'function') return ts.toMillis();
        if ('toDate' in ts && typeof ts.toDate === 'function') return ts.toDate().getTime();
        if ('seconds' in ts && typeof ts.seconds === 'number') return ts.seconds * 1000;
    }
    return 0;
}

/** Format a Firebase timestamp to a localized date string */
export function formatTimestamp(ts: FirebaseTimestamp | undefined, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
    const ms = getTimestampMs(ts);
    if (!ms) return '';
    const defaultOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(ms).toLocaleDateString(locale, options || defaultOptions);
}
