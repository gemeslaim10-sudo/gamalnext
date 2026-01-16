"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function GlobalErrorListener() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            // Filter out extension errors or common benign errors
            if (event.message.includes("Extension") || event.message.includes("ResizeObserver")) return;

            console.error("Global Error Caught:", event.error);
            toast.error(`Error: ${event.message}`, { duration: 5000 });
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            // Specifically handling Firestore Index errors which come as promise rejections
            const reason = event.reason;
            const message = reason?.message || reason?.toString() || "Unknown Error";

            console.error("Unhandled Promise Rejection:", reason);

            if (message.includes("requires an index")) {
                toast.error("مطلوب إنشاء Index! (راجع الكونسول)", { duration: 8000, icon: '🔥' });
            } else if (message.includes("permission-denied")) {
                toast.error("فشل الوصول للبيانات: تأكد من الصلاحيات (Rules)", { duration: 5000 });
            } else {
                // General unknown errors
                if (!message.includes("ResizeObserver")) {
                    toast.error(`System Error: ${message.substring(0, 50)}...`, { duration: 4000 });
                }
            }
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);

        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, []);

    return null;
}
