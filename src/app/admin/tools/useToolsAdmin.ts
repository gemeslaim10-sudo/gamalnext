import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { INITIAL_TOOLS } from './constants';
import type { ToolData } from './types';

export function useToolsAdmin() {
    const [tools, setTools] = useState<ToolData[]>([]);
    const [loading, setLoading] = useState(true);

    const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    useEffect(() => {
        const timers = debounceTimers.current;
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, []);

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, 'tools'));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ToolData));
            setTools(data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch tools");
        } finally {
            setLoading(false);
        }
    };

    const seedDatabase = async () => {
        if (!confirm("This will overwrite/reset standard tools. Continue?")) return;
        try {
            for (const tool of INITIAL_TOOLS) {
                await setDoc(doc(db, 'tools', tool.id), tool);
            }
            toast.success("Database seeded with initial tools");
            fetchTools();
        } catch (e) {
            console.error(e);
            toast.error("Failed to seed database");
        }
    };

    const saveChanges = async (updatedTool: ToolData) => {
        try {
            await updateDoc(doc(db, 'tools', updatedTool.id), { ...updatedTool });
            // Optional toast if we wanted feedback on autosave, but usually too noisy.
        } catch {
            toast.error("Failed to update");
        }
    };

    const debouncedSave = useCallback((updatedTool: ToolData) => {
        const existing = debounceTimers.current.get(updatedTool.id);
        if (existing) clearTimeout(existing);

        const timer = setTimeout(() => {
            debounceTimers.current.delete(updatedTool.id);
            saveChanges(updatedTool);
        }, 1000); // Wait 1s after last keystroke

        debounceTimers.current.set(updatedTool.id, timer);
    }, []);

    return {
        tools,
        loading,
        seedDatabase,
        debouncedSave
    };
}
