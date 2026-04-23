export const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    // Go to Cloudinary Dashboard > Settings > Upload > Upload Presets
    // Set "ml_default" Signing Mode to "Unsigned", or create a new unsigned preset
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
};

/**
 * Maximum time (ms) to wait for the Cloudinary script to load.
 */
const CLOUDINARY_LOAD_TIMEOUT = 10_000;

/**
 * Wait for window.cloudinary to become available (the script is loaded lazily).
 * Rejects after a timeout if the script never loads (e.g. blocked by an ad-blocker).
 */
function waitForCloudinary(): Promise<any> {
    return new Promise((resolve, reject) => {
        // Already available
        if (typeof window !== "undefined" && (window as any).cloudinary) {
            return resolve((window as any).cloudinary);
        }

        const start = Date.now();
        const interval = setInterval(() => {
            if ((window as any).cloudinary) {
                clearInterval(interval);
                return resolve((window as any).cloudinary);
            }
            if (Date.now() - start > CLOUDINARY_LOAD_TIMEOUT) {
                clearInterval(interval);
                reject(
                    new Error(
                        "لم يتم تحميل سكريبت Cloudinary. قد يكون هناك مانع إعلانات أو مشكلة في الاتصال."
                    )
                );
            }
        }, 200);
    });
}

/**
 * Opens the Cloudinary upload widget.
 *
 * @param onUpload  Callback invoked with the uploaded file's secure URL.
 * @param onError   Optional callback invoked when the widget fails to load or
 *                  an upload error occurs. If omitted, errors are logged to the
 *                  console.
 */
export const openCloudinaryWidget = async (
    onUpload: (url: string | string[]) => void,
    onError?: (error: Error) => void,
    options?: { multiple?: boolean }
) => {
    try {
        const cloudinary = await waitForCloudinary();

        cloudinary.openUploadWidget(
            {
                cloudName: cloudinaryConfig.cloudName,
                uploadPreset: cloudinaryConfig.uploadPreset,
                sources: ["local", "url", "camera"],
                multiple: options?.multiple || false,
                resourceType: "auto", // Allow images, videos, etc.
                clientAllowedFormats: ["image", "video"], // Specific allowed types
            },
            (error: any, result: any) => {
                if (error) {
                    const uploadError = new Error(
                        `خطأ في رفع الملف: ${error.message || "خطأ غير معروف"}`
                    );
                    console.error("Cloudinary upload error:", error);
                    onError?.(uploadError);
                    return;
                }
                if (result && result.event === "success") {
                    onUpload(result.info.secure_url);
                } else if (result && result.event === "queues-end" && options?.multiple) {
                    // Collect all URLs if multiple is true
                    const urls = result.info.files.map((f: any) => f.uploadInfo.secure_url);
                    if (urls.length > 0) {
                        onUpload(urls);
                    }
                }
            }
        );
    } catch (err) {
        const loadError =
            err instanceof Error
                ? err
                : new Error("فشل في فتح نافذة رفع الملفات");
        console.error("Cloudinary widget error:", loadError);
        onError?.(loadError);
    }
};
