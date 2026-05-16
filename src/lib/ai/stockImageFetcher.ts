export async function fetchStockImage(keyword: string, unsplashKey?: string, pexelsKey?: string) {
    let imageUrl = "";
    const unsplashKeyword = encodeURIComponent(keyword);

    try {
        if (unsplashKey) {
            const unsplashRes = await fetch(
                `https://api.unsplash.com/photos/random?query=${unsplashKeyword}&orientation=landscape`,
                { headers: { 'Authorization': `Client-ID ${unsplashKey}` } }
            );

            if (unsplashRes.ok) {
                const data = await unsplashRes.json();
                if (data.urls?.regular) {
                    imageUrl = data.urls.regular;
                }
            }
        }

        if (!imageUrl) {
            imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
        }
    } catch (error) {
        console.error("Unsplash error:", error);
        imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
    }

    if (!imageUrl && pexelsKey) {
        try {
            const randomPage = Math.floor(Math.random() * 10) + 1;
            const pexelsRes = await fetch(
                `https://api.pexels.com/v1/search?query=${unsplashKeyword}&per_page=1&page=${randomPage}&orientation=landscape`,
                { headers: { Authorization: pexelsKey } }
            );

            if (pexelsRes.ok) {
                const pexelsData = await pexelsRes.json();
                if (pexelsData.photos && pexelsData.photos.length > 0) {
                    imageUrl = pexelsData.photos[0].src.large;
                }
            }
        } catch (error) {
            console.error("Pexels (Gen Image) Error:", error);
        }
    }

    if (!imageUrl) {
        imageUrl = `https://source.unsplash.com/1280x720/?${unsplashKeyword}`;
    }

    return imageUrl;
}
