export const fetchStockImage = async (imageKeyword: string): Promise<string> => {
    let imageUrl = "";
    const unsplashKeyword = encodeURIComponent(imageKeyword || "technology");
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (unsplashAccessKey) {
        try {
            const unsplashRes = await fetch(
                `https://api.unsplash.com/photos/random?query=${unsplashKeyword}&orientation=landscape`,
                { headers: { 'Authorization': `Client-ID ${unsplashAccessKey}` } }
            );

            if (unsplashRes.ok) {
                const unsplashData = await unsplashRes.json();
                if (unsplashData.urls?.regular) {
                    imageUrl = unsplashData.urls.regular;
                }
            }
        } catch (error) {
            console.error("Unsplash fetch error:", error);
        }
    }

    const pexelsApiKey = process.env.PEXELS_API_KEY;
    if (!imageUrl && pexelsApiKey) {
        try {
            const randomPage = Math.floor(Math.random() * 10) + 1;
            const pexelsRes = await fetch(
                `https://api.pexels.com/v1/search?query=${unsplashKeyword}&per_page=1&page=${randomPage}&orientation=landscape`,
                { headers: { Authorization: pexelsApiKey } }
            );

            if (pexelsRes.ok) {
                const pexelsData = await pexelsRes.json();
                if (pexelsData.photos && pexelsData.photos.length > 0) {
                    imageUrl = pexelsData.photos[0].src.large;
                }
            }
        } catch (error) {
            console.error("Pexels fetch error:", error);
        }
    }

    if (!imageUrl) {
        imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
    }

    return imageUrl;
};
