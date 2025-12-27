export const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    uploadPreset: "ml_default", // We might need to ask user to create this or use signed uploads
};

export const openCloudinaryWidget = (onUpload: (url: string) => void) => {
    // @ts-ignore
    if (window.cloudinary) {
        // @ts-ignore
        window.cloudinary.openUploadWidget(
            {
                cloudName: cloudinaryConfig.cloudName,
                uploadPreset: "unsigned_preset",
                sources: ["local", "url", "camera"],
                multiple: false,
                resourceType: "auto", // Allow images, videos, etc.
                clientAllowedFormats: ["image", "video"], // Specific allowed types
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    onUpload(result.info.secure_url);
                }
            }
        );
    }
};
