import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';


// Global map to throttle writes to Firestore (1 write per minute per tool)
const lastWriteMap = new Map<string, number>();

export const useToolHistory = () => {
    const { user } = useAuth();

    const addToHistory = async (toolId: string, toolName: string, description: string, fileUrl?: string, fileType?: string) => {
        if (!user) return; // Only save for logged-in users

        // Throttle logic
        const now = Date.now();
        const key = `${user.uid}-${toolId}`;
        const lastWrite = lastWriteMap.get(key) || 0;
        if (now - lastWrite < 60000) return; // Skip if less than 60 seconds
        lastWriteMap.set(key, now);

        try {
            await addDoc(collection(db, 'user_history'), {
                userId: user.uid,
                toolId,
                toolName,
                description,
                fileUrl: fileUrl || null,
                fileType: fileType || 'action',
                createdAt: serverTimestamp()
            });
            // Optional: toast.success('Saved to history');
        } catch (error) {
            console.error("Error saving history:", error);
            // Silent fail is better than annoying user for non-critical feature
        }
    };

    return { addToHistory };
};
