/**
 * Gives a tool's drawing canvas the image's real pixel size (this also clears it). The canvas is
 * stretched over the displayed image, so pointer positions are scaled up to these pixels.
 */
export const fitCanvasToImage = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    canvas.width = image.width;
    canvas.height = image.height;
};

export const applyCanvasOverlay = async (
    originalImageSrc: string,
    overlayCanvas: HTMLCanvasElement
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                const ctx = canvas.getContext("2d");
                
                if (!ctx) throw new Error("No 2d context");
                
                // Draw original
                ctx.drawImage(image, 0, 0);
                
                // Draw overlay scaled
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;
                
                ctx.drawImage(
                    overlayCanvas,
                    0,
                    0,
                    overlayCanvas.width,
                    overlayCanvas.height,
                    0,
                    0,
                    overlayCanvas.width * scaleX,
                    overlayCanvas.height * scaleY
                );
                
                resolve(canvas.toDataURL("image/webp"));
            } catch (e) {
                reject(e);
            }
        };
        image.onerror = reject;
        image.src = originalImageSrc;
    });
};
