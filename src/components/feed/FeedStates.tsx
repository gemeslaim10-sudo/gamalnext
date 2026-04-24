"use client";

export function FeedSkeleton() {
    return (
        <div className="space-y-8">
            {[1, 2, 3].map(n => (
                <div key={n} className="bg-slate-900/60 border border-white/5 rounded-[2rem] overflow-hidden animate-pulse">
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                            <div className="h-3 bg-slate-800/60 rounded w-1/4"></div>
                        </div>
                    </div>
                    <div className="px-6 pb-4 space-y-2">
                        <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                        <div className="h-4 bg-slate-800/60 rounded w-full"></div>
                        <div className="h-4 bg-slate-800/60 rounded w-5/6"></div>
                    </div>
                    <div className="aspect-video bg-slate-800/40"></div>
                </div>
            ))}
        </div>
    );
}

export function FeedErrorBanner({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm">
            <p className="font-bold">⚠️ Failed to load feed</p>
            <p className="mt-1 opacity-70 text-xs font-mono">{error}</p>
            <button onClick={onRetry} className="mt-2 text-xs underline">
                Retry
            </button>
        </div>
    );
}

export function FeedEndMessage() {
    return (
        <div className="py-12 text-center text-slate-500 font-medium">
            You&apos;ve reached the end! 🚀
        </div>
    );
}

export function FeedLoadingSpinner() {
    return (
        <div className="py-8 flex justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
        </div>
    );
}
