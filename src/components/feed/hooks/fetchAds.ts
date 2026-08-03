import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FeedAd } from "../types";

let _adsCache: FeedAd[] | null = null;
let _adsFetchPromise: Promise<FeedAd[]> | null = null;

export function fetchAdsOnce(): Promise<FeedAd[]> {
    if (_adsCache) return Promise.resolve(_adsCache);
    if (_adsFetchPromise) return _adsFetchPromise;

    _adsFetchPromise = getDocs(query(collection(db, "ads"), where("active", "==", true)))
        .then(snap => {
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as FeedAd));
            _adsCache = all.filter(ad => (ad as FeedAd & { showInFeed?: boolean }).showInFeed === true);
            return _adsCache;
        })
        .catch((e) => {
            console.error("Failed to load ads", e);
            _adsFetchPromise = null; 
            return [] as FeedAd[];
        });

    return _adsFetchPromise;
}
