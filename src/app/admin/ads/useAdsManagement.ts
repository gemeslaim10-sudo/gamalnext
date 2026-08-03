import { useState, useEffect, useCallback } from "react";
import {
    collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Ad, EMPTY_FORM } from "./types";

export function useAdsManagement() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchAds = useCallback(async () => {
        setLoading(true);
        try {
            const snap = await getDocs(query(collection(db, "ads"), orderBy("createdAt", "desc")));
            setAds(snap.docs.map(d => ({ id: d.id, ...d.data() } as Ad)));
        } catch (e) {
            console.error(e);
            toast.error("Failed to load ads");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const openEdit = (ad: Ad) => {
        setForm({
            title: ad.title,
            description: ad.description,
            imageUrl: ad.imageUrl,
            whatsappMessage: ad.whatsappMessage,
            whatsappNumber: ad.whatsappNumber,
            active: ad.active,
            showInSidebar: ad.showInSidebar ?? true,
            showInFeed: ad.showInFeed ?? false,
        });
        setEditingId(ad.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.description.trim()) {
            toast.error("Title and description are required.");
            return;
        }
        if (!form.showInSidebar && !form.showInFeed) {
            toast.error("يجب اختيار مكان ظهور واحد على الأقل.");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                // UPDATE existing ad
                await updateDoc(doc(db, "ads", editingId), { ...form });
                toast.success("تم تحديث الإعلان!");
                setAds(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
            } else {
                // CREATE new ad
                await addDoc(collection(db, "ads"), { ...form, createdAt: serverTimestamp() });
                toast.success("تم إنشاء الإعلان!");
                fetchAds();
            }
            closeForm();
        } catch (e) {
            console.error(e);
            toast.error("فشل حفظ الإعلان.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id: string, current: boolean) => {
        try {
            await updateDoc(doc(db, "ads", id), { active: !current });
            setAds(prev => prev.map(a => a.id === id ? { ...a, active: !current } : a));
            toast.success(`Ad ${!current ? "activated" : "deactivated"}`);
        } catch (e) {
            console.error(e);
            toast.error("Failed to toggle ad.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this ad permanently?")) return;
        try {
            await deleteDoc(doc(db, "ads", id));
            setAds(prev => prev.filter(a => a.id !== id));
            toast.success("Ad deleted.");
        } catch (e) {
            console.error(e);
            toast.error("Failed to delete ad.");
        }
    };

    return {
        ads,
        loading,
        saving,
        form,
        setForm,
        showForm,
        setShowForm,
        editingId,
        openEdit,
        closeForm,
        handleSave,
        handleToggle,
        handleDelete
    };
}
